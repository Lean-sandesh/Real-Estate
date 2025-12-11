const jwt = require('jsonwebtoken');
const config = require('../config/environment');

const generateToken = (id) => {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.expire,
  });
};

module.exports = generateToken;