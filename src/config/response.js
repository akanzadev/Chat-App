const handleSuccess = (res, req, data, message, statusCode = 200) => {
  res.status(statusCode).json({
    statusCode,
    message,
    ...data
  })
}
const handleError = (res, req, message, error, statusCode = 500) => {
  res.status(statusCode).json({
    statusCode,
    message,
    error
  })
}

module.exports = {
  handleSuccess,
  handleError
}
