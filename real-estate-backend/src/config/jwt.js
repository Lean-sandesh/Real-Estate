const config = require('./environment');

const jwtConfig = {
  secret: config.jwt.secret,
  expiresIn: config.jwt.expire,
  issuer: 'realestate-platform',
  audience: 'realestate-users'
};

module.exports = jwtConfig;