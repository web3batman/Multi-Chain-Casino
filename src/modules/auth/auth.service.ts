import {
  ACCESS_TOKEN_LIFE,
  REFRESH_TOKEN_LIFE,
  REFRESH_TOKEN_SECRET,
  TOKEN_SECRET,
} from "@/config";
import BaseService from "@/utils/base/service";
import { Auth } from "@/utils/db";
import createToken from "@/utils/jwt/create-token";

import { IAuthModel, IGenerateParams, IUpdateOrCreate } from "./auth.types";

export default class AuthService extends BaseService<IAuthModel> {
  constructor() {
    super(Auth);
  }

  updateOrCreate = async (params: IUpdateOrCreate, refreshToken: string) => {
    const isAuthExist = await this.exists(params);
    let doc: IAuthModel;

    if (!isAuthExist) {
      doc = await this.create({ ...params, refreshToken });
    } else {
      doc = await this.update(params, { refreshToken });
    }

    return doc;
  };

  generate(params: IGenerateParams, expiresIn?: number) {
    const accessExpiresIn = expiresIn || ACCESS_TOKEN_LIFE;
    const refreshExpiresIn = expiresIn || REFRESH_TOKEN_LIFE;
    const access = createToken(params, TOKEN_SECRET, accessExpiresIn);
    const refresh = createToken(params, REFRESH_TOKEN_SECRET, refreshExpiresIn);

    return {
      accessToken: access.token,
      refreshToken: refresh.token,
      expiresIn: access.expiresIn,
    };
  }
}
