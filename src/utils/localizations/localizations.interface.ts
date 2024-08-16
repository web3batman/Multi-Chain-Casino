interface ILocalization {
  ERRORS: {
    AUTH: {
      USE_NEW_TOKEN: string;
    };
    USER: {
      NOT_EXIST: string;
      USER_ALREADY_EXIST: string;
      USER_NOT_CREATED: string;
      USERNAME_OR_PASSWORD_INVALID: string;
      OLD_PASSWORD_INVALID: string;
      SIGN_WALLETADDRESS_INCORRECT: string;
      SIGN_WALLETINFO_INCORRECT: string;
      UPDATE_USER_INFO: string;
    };
    OTHER: {
      EMAIL_WITH_CODE_NOT_SENDED: string;
      ERROR_WITH_SEND_MESSAGE: string;
      ITEM_NOT_FOUND: string;
      ID_IS_INVALID: string;
      CODE_IS_INVALID: string;
      UNAUTHORIZED: string;
      FORBIDDEN: string;
      NOT_FOUND_ENDPOINT: string;
      CONFLICT: string;
      SOMETHING_WENT_WRONG: string;
      REFRESH_TOKEN_INVALID: string;
      PASSWORD_ERROR: string;
      NO_WALLET: string;
      DUPLICATE_ITEM: string;
      USER_PLAN_AND_PROGRESS_UPDATE_FAILED: string;
    };
    PAYMENT: {
      GET_CUSTOMER: string;
      REPLACE_CUSTOMER: string;
      CREATE_CARD_TOKEN: string;
      CREATE_CARD: string;
      CREATE_SUBSCRIBE: string;
      GET_CUSTOMER_INFO: string;
      GET_SUBSCRIBE: string;
      DELETE_SUBSCRIBE: string;
      SUBSCRIBE_NOT_FOUND: string;
      PERMISSION_DENIED: string;
      USER_CARDS_EMPTY: string;
      GET_CARD: string;
      USER_ALREADY_HAVE_SUBSCRIBE: string;
      USER_ALREADY_HAVE_CARD: string;
      CREATE_CUSTOMER: string;
    };
    PAYMENT_WALLET: {
      GET: string;
      UPDATE_ADDRESS: string;
      ADD_WALLET: string;
      STATUS: string;
    };
  };
}
export default ILocalization;
