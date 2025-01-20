const { constants } = require("../constants/constants");

const errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  switch (statusCode) {
    case constants.NOT_FOUND:
      res.status(statusCode).json({
        message: "Not found",
        error: error.message,
      });
      break;
    case constants.INTERNAL_SERVER_ERROR:
      res
        .status(statusCode)
        .json({ message: "Internal server error", error: error.message });
      break;
    case constants.UNAUTHORIZED:
      res
        .status(statusCode)
        .json({ message: "Unauthorized", error: error.message });
      break;
    case constants.BAD_REQUEST:
      res
        .status(statusCode)
        .json({ message: "Bad request", error: error.message });
      break;
    case constants.FORBIDDEN:
      res
        .status(statusCode)
        .json({ message: "Forbidden", error: error.message });
      break;
    case constants.SUCCESS:
      res.status(statusCode)
      .json({ message: "Success", error: error.message });
      break;
    default:
      console.log("No error at all");
      break;
  }
};

module.exports = errorHandler;
