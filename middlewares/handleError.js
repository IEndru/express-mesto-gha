// eslint-disable-next-line no-unused-vars
function handleError(err, req, res, next) {
  const { statusCode = 500 } = err;
  let { message } = err;

  if (statusCode === 500) {
    message = 'Ошибка на стороне сервера';
  } else if (statusCode === 400) {
    message = 'Пожалуйста, проверьте ваши данные.';
  }

  res.status(statusCode).send({ message });
}

module.exports = { handleError };
