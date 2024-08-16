export const device = ({ headers }) => ({
  deviceId: headers.deviceid,
  platform: headers.platform,
});

export const getBody = ({ body }) => body;

export const getCode = ({ body }) => body.code;

export const refreshToken = ({ body }) => body.refreshToken;

export const session = ({ session }) => session;

export const updateToken = (req) => ({
  ...req.body,
});
