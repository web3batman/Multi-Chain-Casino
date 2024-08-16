export const getIdFromParamsWithMe = (req) =>
  req.params.id === "me"
    ? req?.user?.userId
      ? req.user.userId
      : "000000000000000000000000"
    : req.params.id;
