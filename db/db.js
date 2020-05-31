require('dotenv').config()
const Sequelize = require('sequelize');

// const sequelize = new Sequelize(process.env.MYSQL_URL, {
//   dialect: 'mysql',
//   logging: true
// });

const sequelize = new Sequelize(process.env.DB_URL, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: true,
  port: process.env.PORT
});

// const sequelize = new Sequelize('shoppingCart', 'root', 'fishDogHouse109@!', {
//   host: '167.99.111.165',
//   dialect: 'mysql',
//   logging: true
// });

module.exports = sequelize;