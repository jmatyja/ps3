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
    "user": "root",
    "password": "Klebuzsek2",
    "database": "ultimateteam"
  } : {
    "host": "localhost",
    "user": "root",
    "password": "Klebuzsek2",
    "database": "ultimateteamtests"
  },
  serverName: 'main'
}, environment);
