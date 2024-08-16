import { Types } from "mongoose";

export const validateId = (id, helpers) => {
  if (!Types.ObjectId.isValid(id)) {
    return helpers.message("Id not valid");
  }

  return id;
};

export function validateFunc(schema, object) {
  const { error } = schema.validate(object);
  const valid = error == null;

  if (valid) {
    return null;
  } else {
    const { details } = error;
    return details.map((i) => i.message).join(",");
  }
}
