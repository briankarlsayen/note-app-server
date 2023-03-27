class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    error = new ErrorResponse(message, 400);
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  if (
    err.code === 'ERR_BAD_REQUEST' &&
    error?.response?.data?.errors[0]?.code === 'PUSH_TOO_MANY_EXPERIENCE_IDS'
  ) {
    console.log('push notif err', error?.response?.data?.errors[0]);
    error = new ErrorResponse(error.response.data.errors[0].message, 400);
  }

  console.log(error.message);

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
  });
};

module.exports = { errorHandler, ErrorResponse };
