// don`t forget add to swagger

import * as errorResponse from "@/utils/swagger/errors";

import { EXAMPLE_ENUM } from "../example.constant";
import { fullExampleSchema } from "./example.schema";

const tags = ["Example"];
const urlPrefix = "/example";

const getExamples = {
  get: {
    summary: "get all example | [ For all ]",
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
                  items: fullExampleSchema,
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

const getExample = {
  get: {
    summary: "get example | [ For all ]",
    tags,
    parameters: [
      {
        name: "id",
        in: "path",
        default: "me",
        required: true,
        description: "its example id",
      },
    ],
    responses: {
      200: {
        description: "Successfully get example!",
        content: {
          "application/json": {
            schema: fullExampleSchema,
          },
        },
      },
      ...errorResponse.unauthorized,
      ...errorResponse.notFound,
      default: {
        description: "Error get example!",
      },
    },
  },
};

const getExampleByName = {
  get: {
    summary: "get example | [ For all ]",
    tags,
    parameters: [
      {
        name: "name",
        in: "path",
        required: true,
        description: "its example name",
      },
    ],
    responses: {
      200: {
        description: "Successfully get example!",
        content: {
          "application/json": {
            schema: fullExampleSchema,
          },
        },
      },
      ...errorResponse.badRequest,
      ...errorResponse.unauthorized,
      ...errorResponse.notFound,
      default: {
        description: "Error get example!",
      },
    },
  },
};

const editExample = {
  put: {
    summary: "edit user | [ For admin ]",
    tags,
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
      },
    ],
    requestBody: {
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              name: { type: "string", required: false },
              type: {
                type: "string",
                enum: Object.keys(EXAMPLE_ENUM),
                required: false,
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "Successfully edit example!",
        content: {
          "application/json": {
            schema: fullExampleSchema,
          },
        },
      },
      ...errorResponse.unauthorized,
      ...errorResponse.forbidden,
      ...errorResponse.notFound,
      default: {
        description: "Error edit example!",
      },
    },
  },
};

const deleteExample = {
  delete: {
    summary: "Delete example | [ For admin ]",
    tags,
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
      },
    ],
    responses: {
      200: {
        description: "Successfully deleted example!",
        content: {
          "application/json": {
            schema: fullExampleSchema,
          },
        },
      },
      ...errorResponse.badRequest,
      ...errorResponse.unauthorized,
      ...errorResponse.forbidden,
      ...errorResponse.notFound,
    },
  },
};

export default {
  [`${urlPrefix}`]: getExamples,
  [`${urlPrefix}/{id}`]: Object.assign(
    {},
    editExample,
    getExample,
    deleteExample
  ),
  [`${urlPrefix}/name`]: getExampleByName,
};
