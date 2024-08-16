import { Request } from "express";
import expressJwt from "express-jwt";

import { TOKEN_SECRET } from "@/config";

const publicPaths = [
  "/favicon.ico",
  { url: /\/api\/v1\/docs.*/ },
  { url: /\/api\/v[0-9]{1}\/version/ },
  { url: /\/api\/v[0-9]{1}\/status/ },
  { url: "/api/v1/auth/sign-up" },
  { url: "/api/v1/auth/sign-in" },
  { url: "/api/v1/auth/wallet" },
  { url: "/api/v1/auth/update-token" },
  { url: "/api/v1/support" },
  { url: /\/api\/v1\/project-user\/invite\/.*/ },
  { url: /\/api\/v1\/project\/name\/.*/ },
  { url: /\/api\/v1\/project\/id\/.*/ },
  { url: /\/api\/v1\/support\/.*/ },
  { url: "/api/v1/staking/create" },
  { url: "/api/v1/staking/history" },
  { url: "/api/v1/staking/user" },
  { url: /\/api\/v1\/trait\/kart\/.*/ },
];

export default expressJwt({
  secret: TOKEN_SECRET,
  algorithms: ["HS256"],
  userProperty: "token",
  getToken: (req: Request) => {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      return req.headers.authorization.split(" ")[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
  },
}).unless({
  path: publicPaths,
});
