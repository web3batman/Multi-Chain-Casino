export const mongoId = (required = false) => {
  return {
    type: "string",
    pattern: "/^[0-9a-fA-F]{24}$/",
    example: "627f7889bc3d1b3795cfe5a1",
    required: required,
  };
};

export const mongoObject = {
  _id: mongoId(true),
  updatedAt: { type: "string", format: "date-time", required: true },
  createdAt: { type: "string", format: "date-time", required: true },
};
