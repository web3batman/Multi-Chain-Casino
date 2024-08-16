import ILocalization from "./localizations.interface";

const en: ILocalization = {
  ERRORS: {
    AUTH: {
      USE_NEW_TOKEN: "Auth change need use new token",
    },
    USER: {
      NOT_EXIST: "User does not exist",
      USER_ALREADY_EXIST: "User already exists",
      USER_NOT_CREATED: "User not created",
      USERNAME_OR_PASSWORD_INVALID: "Username or password invalid",
      SIGN_WALLETADDRESS_INCORRECT: "Wallet address invalid",
      SIGN_WALLETINFO_INCORRECT: "Wallet signature invalid",
      UPDATE_USER_INFO: "Please update your info",
      OLD_PASSWORD_INVALID: "Current password invalid",
    },
    OTHER: {
      EMAIL_WITH_CODE_NOT_SENDED: "Email with code not sended",
      ERROR_WITH_SEND_MESSAGE: "Message not sent",
      ITEM_NOT_FOUND: "Item not found",
      ID_IS_INVALID: "Id is invalid",
      CODE_IS_INVALID: "Code is not valid",
      UNAUTHORIZED: "Unauthorized",
      FORBIDDEN: "Forbidden",
      NOT_FOUND_ENDPOINT: "Not Found! Wrong api endpoint",
      CONFLICT: "Conflict",
      DUPLICATE_ITEM: "Duplicate Item!",
      SOMETHING_WENT_WRONG: "Something went wrong",
      REFRESH_TOKEN_INVALID: "Refresh token not valid",
      PASSWORD_ERROR:
        "The password must contain 1 lowercase and uppercase letter, 1 number and be more than 8 characters",
      NO_WALLET: "Wallet is required",
      USER_PLAN_AND_PROGRESS_UPDATE_FAILED:
        "User plan and progress update failed",
    },
    PAYMENT: {
      GET_CUSTOMER: "Get customer error",
      REPLACE_CUSTOMER: "Replace customer error",
      CREATE_CARD_TOKEN: "Create card token error",
      CREATE_CARD: "Create card error",
      CREATE_SUBSCRIBE: "Create subscribe error",
      GET_CUSTOMER_INFO: "Get customer info error",
      GET_SUBSCRIBE: "Get subscribe error",
      DELETE_SUBSCRIBE: "Delete subscribe error",
      SUBSCRIBE_NOT_FOUND: "Subscribe not found",
      PERMISSION_DENIED: "Permission denied",
      USER_CARDS_EMPTY: "No Card on File",
      GET_CARD: "Get cards by user error",
      USER_ALREADY_HAVE_SUBSCRIBE: "User have subscribe",
      USER_ALREADY_HAVE_CARD: "User have card",
      CREATE_CUSTOMER: "Create customer error",
    },
    PAYMENT_WALLET: {
      GET: "Get wallet info",
      UPDATE_ADDRESS: "Update wallet address",
      ADD_WALLET: "Add wallet",
      STATUS: "Get wallet status",
    },
  },
};

export default en;
