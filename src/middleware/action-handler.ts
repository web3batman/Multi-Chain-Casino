import logger from "@/utils/logger";

export default function actionHandler(action, mapProperty?, accumulator?) {
  return async (req, res) => {
    let property = [];

    if (mapProperty) {
      if (Array.isArray(mapProperty)) {
        property = mapProperty.map((propertyAction) => propertyAction(req));
      } else {
        property = [mapProperty(req)];
      }
    }

    if (accumulator) {
      if (Array.isArray(accumulator)) {
        property = property.concat(accumulator);
      } else {
        property.push(accumulator);
      }
    }

    return action(...property)
      .then((result) => sendResponseSuccess(res, result))
      .catch((err) => sendResponseFail(res, err));
  };
}

function sendResponseSuccess(
  res,
  result: { status?: number | boolean; payload?: object | boolean }
) {
  if (!result) {
    return res.status(200);
  }

  const { status = false, payload = false } = result;

  if (status && typeof status === "number" && payload) {
    return res.status(status).json(payload);
  } else if (status && typeof status === "number" && !payload) {
    return res.sendStatus(status);
  } else if (!status && payload) {
    return res.status(200).json(payload);
  } else {
    return res.status(200).json(result);
  }
}

function sendResponseFail(res, error) {
  logger.error(error);
  res.status(error.status || 400).json({ error: error.message });
}
