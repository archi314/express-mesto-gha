const jwt = require('jsonwebtoken');

const auth = (res, req, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'SECRET');
  } catch (err) {
    next(err);
  }

  req.user = payload;
  next();
};

module.exports = auth;
