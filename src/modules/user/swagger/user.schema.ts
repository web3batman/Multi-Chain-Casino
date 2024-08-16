import * as UserConstant from "../user.constant";

const user = {
  name: { type: "string", required: true },
  role: {
    type: "string",
    enum: UserConstant.ROLE,
    default: UserConstant.ROLE.MEMBER,
    required: false,
  },
};

const additionUser = {
  avatar: {
    type: "string",
    description: "avatar name file in store",
    required: true,
  },
  role: {
    type: "string",
    enum: Object.keys(UserConstant.ROLE),
    default: UserConstant.ROLE.MEMBER,
  },
  status: {
    type: "string",
    enum: Object.keys(UserConstant.STATUS),
    default: UserConstant.STATUS.NOT_VERIFIED,
  },
};

export const permissionsSchema = {
  type: "object",
  properties: {
    roles: {
      type: "array",
      items: {
        type: "string",
        enum: Object.keys(UserConstant.ROLE),
      },
      example: Object.keys(UserConstant.ROLE),
      required: true,
    },
    statusArr: {
      type: "array",
      items: {
        type: "string",
        enum: Object.keys(UserConstant.STATUS),
      },
      example: Object.keys(UserConstant.STATUS),
      required: true,
    },
  },
};

export const shortUserSchemaWithoutPassword = {
  type: "object",
  properties: {
    _id: { type: "string", required: true },
    ...user,
    status: {
      type: "string",
      enum: Object.keys(UserConstant.STATUS),
      default: UserConstant.STATUS.VERIFIED,
    },
  },
};

export const shortUserSchema = {
  type: "object",
  properties: {
    _id: { type: "string", required: true },
    ...user,
    password: { type: "string", required: true },
  },
};

export const fullUserSchema = {
  type: "object",
  properties: {
    _id: { type: "string", required: true },
    ...user,
    ...additionUser,
    planId: { type: "string", description: "current plan id" },
    avatarUrl: {
      type: "string",
      description: "url for getting avatar in store",
    },
    currentDay: {
      type: "number",
      description: "day progress for user",
      required: true,
    },
    userAnswers: {
      type: "array",
      items: {
        type: "object",
      },
    },
  },
};
