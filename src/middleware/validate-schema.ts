export default function validateSchema(schema, mapProperty) {
  return (req, res, next) => {
    const property = mapProperty ? mapProperty(req) : req.body;
    const { error } = schema.validate(property);

    if (error == null) {
      return next();
    } else {
      const { details } = error;
      const message = details.map((i) => i.message).join(",");

      return res.status(400).json({
        error: message,
      });
    }
  };
}
