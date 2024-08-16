import { URL } from "url";

import { BASE_URL, PORT } from "@/config";
import {
  authSchema,
  authSwagger,
  deviceParameters,
} from "@/modules/auth/swagger";
import { userSchema, userSwagger } from "@/modules/user/swagger";

export default {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "APIs Document for YieldLab method",
  },
  servers: [
    {
      url: new URL("/api/v1", BASE_URL),
    },
    {
      url: `http://127.0.0.1:${PORT}/api/v1`,
    },
    {
      url: "https://coral-app-2-tnvsk.ondigitalocean.app/api/v1",
    },
    {},
  ],
  components: {
    parameters: deviceParameters,
    schemas: Object.assign({}, userSchema, authSchema, {}),
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: ["read", "write"],
    },
  ],
  paths: Object.assign({}, userSwagger, authSwagger),
};
