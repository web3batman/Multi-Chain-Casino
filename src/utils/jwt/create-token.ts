import jwt from "jsonwebtoken";

import { TOKEN_LIFE, TOKEN_SECRET } from "@/config";
import { IAuthInfo } from "@/modules/auth/auth.types";

type TokenResult = {
  token: string;
  expiresIn?: number | string;
};

export default (
  info: IAuthInfo,
  secret = TOKEN_SECRET,
  expiresIn = TOKEN_LIFE
): TokenResult => {
  const result: Partial<TokenResult> = {};

  const option = expiresIn ? { expiresIn } : {};

  if (expiresIn) {
    result.expiresIn = expiresIn;
  }

  result.token = jwt.sign(info, secret, option);

  return result as TokenResult;
};
