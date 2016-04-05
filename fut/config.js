require('babel-polyfill');

const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
  db: environment.isProduction ? {
    "host": "localhost",
    "user": "jmatyja",
    "password": "",
    "database": "ultimateteam"
  } : {
    "host": "localhost",
    "user": "jmatyja",
    "password": "",
    "database": "ultimateteamtests"
  },
  serverName: 'main'
}, environment);
