import logger from '../config/logger.js';

export const handleError = (res, statusCode, message, details = null) => {
  logger.error(message, { details });
  return res.status(statusCode).json({
    success: false,
    error: { message, details }
  });
};

export const handleSuccess = (res, statusCode, data, message = null) => {
  logger.info(message || 'Success', { data });
  return res.status(statusCode).json({
    success: true,
    data,
    message
  });
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
