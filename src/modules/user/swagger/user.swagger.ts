import * as errorResponse from "@/utils/swagger/errors";

import { STATUS } from "../user.constant";
import { permissionsSchema } from "./user.schema";

const tags = ["User"];
const urlPrefix = "/user";

const getUsers = {
  get: {
    summary: "get users list | [ For admin ]",
    tags,
    parameters: [
      {
        name: "offset",
        in: "query",
        required: false,
        default: 0,
        schema: {
          type: "integer",
        },
      },
      {
        name: "limit",
        in: "query",
        required: false,
        default: 10,
        schema: {
          type: "integer",
        },
      },
      {
        name: "text",
        in: "query",
        required: false,
        default: "",
      },
    ],
    responses: {
      200: {
        description: "Successfully get all users!",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                items: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/shortUserSchemaWithoutPassword",
                  },
                },
                count: { type: "number" },
              },
            },
          },
        },
      },
    },
  },
};

const getUserByToken = {
  get: {
    summary: "get user by token | [ For user ]",
    tags,
    responses: {
      200: {
        description: "Successfully get user!",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/fullUserSchema",
            },
          },
        },
      },
      ...errorResponse.unauthorized,
      ...errorResponse.forbidden,
      ...errorResponse.notFound,
      default: {
        description: "Error edit user!",
      },
    },
  },
};

const editUser = {
  put: {
    summary: "edit user | [ For user ]",
    tags,
    requestBody: {
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              avatar: { type: "string", format: "binary" },
              name: { type: "string", required: false },
              wallet: {
                type: "object",
                properties: {
                  items: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                },
                required: false,
              },
              status: {
                type: "string",
                enum: Object.keys(STATUS),
                required: false,
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "Successfully edit user!",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/fullUserSchema",
            },
          },
        },
      },
      ...errorResponse.unauthorized,
      ...errorResponse.forbidden,
      ...errorResponse.notFound,
      default: {
        description: "Error edit user!",
      },
    },
  },
};

const getPermissions = {
  get: {
    summary: "get all permissions | [ For admin ]",
    tags,
    responses: {
      200: {
        content: {
          "application/json": {
            schema: permissionsSchema,
          },
        },
      },
      ...errorResponse.unauthorized,
      default: {
        description: "Error get permissions!",
      },
    },
  },
};

export default {
  [`${urlPrefix}`]: getUsers,
  [`${urlPrefix}/permissions`]: getPermissions,
  [`${urlPrefix}/me`]: Object.assign({}, editUser, getUserByToken),
};
