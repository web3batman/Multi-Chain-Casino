import { verifyADR36Amino } from "@keplr-wallet/cosmos";
import bcrypt from "bcryptjs";
import jwt, { UserJwtPayload } from "jsonwebtoken";

import { REFRESH_TOKEN_SECRET } from "@/config";
import { IUserModel } from "@/modules/user/user.interface";
import UserService from "@/modules/user/user.service";
import { CustomError } from "@/utils/helpers";
import { fromBase64 } from "@/utils/helpers/string-helper";
import * as localizations from "@/utils/localizations";
import ILocalization from "@/utils/localizations/localizations.interface";

import { PaymentService } from "../payment";
import { ROLE } from "../user/user.constant";
import AuthService from "./auth.service";
import { IAuthModel, TSignInPayload } from "./auth.types";

export default class AuthController {
  private service: AuthService;
  private userService: UserService;
  private paymentService: PaymentService;
  private localizations: ILocalization;

  private passwordRegExp = new RegExp(
    /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/g
  );

  constructor() {
    this.service = new AuthService();
    this.userService = new UserService();
    this.paymentService = new PaymentService();

    this.localizations = localizations["en"];
  }

  // username signUp
  signUp = async (data: Partial<IUserModel> & { username: string }) => {
    try {
      const regex = new RegExp(`^${data.username}$`, "i");
      const user = await this.userService.getItem({
        username: regex,
      });

      if (user) {
        throw new CustomError(
          11000,
          this.localizations.ERRORS.USER.USER_ALREADY_EXIST
        );
      }

      let newUser: Partial<IUserModel>;

      try {
        // @TO-DO: add wallet for testnet
        // if (!IS_MAINNET) {
        //   data.wallet = new Map<string, number>([
        //     ["usk", 1000],
        //     ["kart", 1000],
        //   ]);
        // }

        if (data.password) {
          data.password = await bcrypt.hash(data.password, 10);
        }

        data.role = ROLE.MEMBER;
        newUser = await this.userService.updateOrInsert(
          { username: data.username },
          data
        );
      } catch (error) {
        if (error.code == 11000) {
          throw new CustomError(
            409,
            this.localizations.ERRORS.USER.USER_ALREADY_EXIST
          );
        }

        throw new Error(this.localizations.ERRORS.USER.USER_NOT_CREATED);
      }

      const authParams = this.service.generate({
        userId: newUser._id,
        role: newUser.role,
        status: newUser.status,
        signAddress: newUser.signAddress,
      });

      await this.service.updateOrInsert({ userId: newUser._id }, {
        userId: newUser._id,
        refreshToken: authParams.refreshToken,
      } as IAuthModel);

      // @ts-ignore
      delete newUser.password;
      return {
        status: 201,
        payload: {
          auth: authParams,
          user: newUser,
        },
      };
    } catch (error) {
      if (error.status === 11000) {
        throw new CustomError(
          409,
          this.localizations.ERRORS.USER.USER_ALREADY_EXIST
        );
      }

      throw new Error(this.localizations.ERRORS.OTHER.SOMETHING_WENT_WRONG);
    }
  };

  // username signIn
  signIn = async ({
    username,
    password,
    signAddress,
    signedSig,
  }: TSignInPayload) => {
    const regex = new RegExp(`^${username}$`, "i");
    let foundUser = await this.userService.getItem({
      username: regex,
    });

    if (!foundUser) {
      throw new Error(
        this.localizations.ERRORS.USER.USERNAME_OR_PASSWORD_INVALID
      );
    }

    const {
      password: userPassword,
      signAddress: userSignAddress,
      _id: userId,
    } = foundUser;

    const passwordInvalid: boolean = await bcrypt.compare(
      password,
      userPassword
    );

    if (!passwordInvalid) {
      throw new Error(
        this.localizations.ERRORS.USER.USERNAME_OR_PASSWORD_INVALID
      );
    }

    if (!!userSignAddress && userSignAddress !== signAddress) {
      throw new Error(
        this.localizations.ERRORS.USER.SIGN_WALLETADDRESS_INCORRECT
      );
    }

    if (!userSignAddress) {
      const recentDepositAddress =
        await this.paymentService.aggregateByPipeline([
          {
            $match: {
              userId: String(userId),
              txHash: {
                $ne: null,
              },
            },
          },
          {
            $sort: {
              createdAt: -1,
            },
          },
          {
            $group: {
              _id: "$userId",
              mostRecentWallet: {
                $first: "$walletAddress",
              },
            },
          },
        ]);

      if (
        recentDepositAddress?.length > 0 &&
        recentDepositAddress[0]?.mostRecentWallet !== signAddress
      ) {
        throw new Error(
          this.localizations.ERRORS.USER.SIGN_WALLETADDRESS_INCORRECT
        );
      }

      foundUser = await this.userService.updateById(userId, { signAddress });
    }

    const isValid = verifyADR36Amino(
      "kujira",
      signAddress,
      "Sign in to Kartel Project",
      fromBase64(signedSig.pub_key.value),
      fromBase64(signedSig.signature)
    );

    if (!isValid) {
      throw new Error(this.localizations.ERRORS.USER.SIGN_WALLETINFO_INCORRECT);
    }

    const auth = await this.setAuth(foundUser);
    let paymentInformation;
    delete foundUser.password;
    return {
      status: 200,
      payload: {
        auth,
        user: foundUser,
        paymentInformation,
      },
    };
  };

  // update token
  updateToken = async (
    { deviceId, platform },
    refreshToken: { refreshToken: string }
  ) => {
    const authParams = await this.service.getItem(refreshToken, {
      _id: 0,
      userId: 1,
      deviceId: 1,
      platform: 1,
    });

    if (!authParams) {
      throw new CustomError(
        404,
        this.localizations.ERRORS.OTHER.REFRESH_TOKEN_INVALID
      );
    }

    const decodeToken = <UserJwtPayload>(
      jwt.verify(refreshToken.refreshToken, REFRESH_TOKEN_SECRET)
    );

    if (deviceId !== decodeToken?.deviceId) {
      throw new CustomError(403, this.localizations.ERRORS.OTHER.FORBIDDEN);
    }

    const user = await this.userService.getItemById(authParams.userId, {
      password: 0,
    });

    const newAuthParams = this.service.generate({
      userId: user._id,
      role: user.role,
      status: user.status,
      deviceId: deviceId,
      platform: platform,
      signAddress: user.signAddress,
    });

    await this.service.create({
      deviceId: deviceId,
      platform: platform,
      userId: user._id,
      refreshToken: authParams.refreshToken,
    } as IAuthModel);

    return {
      status: 201,
      payload: {
        auth: newAuthParams,
        user,
      },
    };
  };

  logout = async ({ deviceId }, info) => {
    if (deviceId !== info.deviceId) {
      throw new CustomError(401, this.localizations.ERRORS.OTHER.UNAUTHORIZED);
    }

    await this.service.delete({
      deviceId,
      userId: info.userId,
      platform: info.platform,
    });

    return { message: "Success" };
  };

  setAuth = async (user: IUserModel) => {
    const auth = this.service.generate({
      userId: user._id,
      role: user.role,
      status: user.status,
      signAddress: user.signAddress,
    });
    await this.service.updateOrCreate(
      {
        userId: user._id,
      },
      auth.refreshToken
    );

    return auth;
  };

  resetPassword = async (data) => {
    const user = await this.userService.getItemById(data.userId);

    if (!user) {
      throw new CustomError(404, this.localizations.ERRORS.USER.NOT_EXIST);
    }

    const { oldPassword, newPassword } = data;
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      throw new CustomError(
        401,
        this.localizations.ERRORS.USER.OLD_PASSWORD_INVALID
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userService.update(user._id, { password: hashedPassword });

    return {
      status: 200,
      message: "Password updated successfully",
    };
  };
}
