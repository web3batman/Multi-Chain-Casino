import generateErrorSchemaForSwagger, * as errorResponse from "@/utils/swagger/errors";

const tags = ["Auth"];
const urlPrefix = "/auth";

const signUp = {
  post: {
    summary: "sign-up",
    tags,
    security: [],
    parameters: [
      {
        $ref: "#/components/parameters/deviceId",
      },
      {
        $ref: "#/components/parameters/platform",
      },
    ],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: { type: "string", required: true },
              userEmail: {
                type: "string",
                required: true,
                example: "string@gmail.com",
              },
              password: { type: "string", required: true },
            },
          },
        },
      },
    },
    responses: {
      201: {
        description: "Successfully auth!",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/signUpResponse",
            },
          },
        },
      },
      ...generateErrorSchemaForSwagger(400, "User not created"),
      ...generateErrorSchemaForSwagger(409, "User already exists"),
      default: {
        description: "Error auth!",
      },
    },
  },
};

const signIn = {
  post: {
    summary: "sign-in",
    tags,
    security: [],
    parameters: [
      {
        $ref: "#/components/parameters/deviceId",
      },
      {
        $ref: "#/components/parameters/platform",
      },
    ],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              userEmail: {
                type: "string",
                required: true,
                example: "string@gmail.com",
              },
              password: { type: "string", required: true },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "Successfully auth!",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/signInResponse",
            },
          },
        },
      },

      ...generateErrorSchemaForSwagger(400, "Email or password is not valid"),
      default: {
        description: "Error auth!",
      },
    },
  },
};

const walletSignIn = {
  post: {
    summary: "wallet sign-in | [ For All ]",
    tags,
    security: [],
    parameters: [
      {
        $ref: "#/components/parameters/deviceId",
      },
      {
        $ref: "#/components/parameters/platform",
      },
    ],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              wallet: {
                type: "string",
                required: true,
                example:
                  "addr1qyhzv8kuhvtkgas3n7fthjaurszfseegwsfpspw0plmw6rekrtdpq5aclxm6pfxpc5nmr0uqew06e0ut3n4wxzu3muyqryau0d",
              },
            },
          },
        },
      },
    },
    responses: {
      201: {
        description: "Successfully auth!",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/signUpResponse",
            },
          },
        },
      },
      ...generateErrorSchemaForSwagger(400, "User not created"),
      ...generateErrorSchemaForSwagger(409, "User already exists"),
      default: {
        description: "Error auth!",
      },
    },
  },
};

const signInUser = JSON.parse(JSON.stringify(signIn));
signInUser.post.summary = "signIn | [ For user ]";

const signInAdmin = JSON.parse(JSON.stringify(signIn));
signInAdmin.post.security = [{ bearerAuth: ["read", "write"] }];
signInAdmin.post.summary = "signIn | [ For Admin ]";

const updateToken = {
  post: {
    summary: "update token",
    tags,
    security: [],
    parameters: [
      {
        $ref: "#/components/parameters/deviceId",
      },
      {
        $ref: "#/components/parameters/platform",
      },
    ],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              refreshToken: { type: "string", required: true },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "Successfully created user!",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/authResponse",
            },
          },
        },
      },
      ...generateErrorSchemaForSwagger(400, "Refresh token not valid!"),
      ...errorResponse.forbidden,
      default: {
        description: "Error update token!",
      },
    },
  },
};

const logout = {
  post: {
    summary: "logout",
    tags,
    parameters: [
      {
        $ref: "#/components/parameters/deviceId",
      },
      {
        $ref: "#/components/parameters/platform",
      },
    ],
    responses: {
      200: {
        description: "Logout successful!",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: { type: "string", default: "Success" },
              },
            },
          },
        },
      },
      ...generateErrorSchemaForSwagger(400, "Error logout user"),
      ...errorResponse.unauthorized,
      default: {
        description: "Error update token!",
      },
    },
  },
};

// todo: create response for endpoint
export default {
  [`${urlPrefix}/sign-up`]: signUp,
  [`${urlPrefix}/sign-in`]: signInUser,
  [`${urlPrefix}/sign-in/admin`]: signInAdmin,
  [`${urlPrefix}/wallet`]: walletSignIn,
  [`${urlPrefix}/update-token`]: updateToken,
  [`${urlPrefix}/logout`]: logout,
};
