// eslint-disable-next-line no-unused-vars
function handleError(err, req, res, next) {
  const { statusCode = 500, message } = err;
  console.error(err);
  let responseMessage = message;
  if (statusCode === 500) {
    responseMessage = 'Ошибка на стороне сервера';
  }
  res.status(statusCode).send({ message: responseMessage });
}

module.exports = { handleError };
