export enum Messages {
  CREATED = "Created",
}

export type Response = {
  status: 201;
  payload: {
    message: Messages;
  };
};

export function response(message: Messages): Response {
  return {
    status: 201,
    payload: {
      message,
    },
  };
}
