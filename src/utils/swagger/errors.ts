export const badRequest = generateErrorSchemaForSwagger(400, "Bad request");
export const unauthorized = generateErrorSchemaForSwagger(401, "Unauthorized");
export const forbidden = generateErrorSchemaForSwagger(403, "Forbidden");
export const notFound = generateErrorSchemaForSwagger(404, "Not found");
export const conflict = generateErrorSchemaForSwagger(409, "Conflict");

export default function generateErrorSchemaForSwagger(
  statusCode: number,
  description: string
) {
  return {
    [statusCode]: {
      description: description,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              error: { type: "string", example: description },
            },
          },
        },
      },
    },
  };
}
