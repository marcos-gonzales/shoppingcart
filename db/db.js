require('dotenv').config()
const Sequelize = require('sequelize');

// const sequelize = new Sequelize(process.env.MYSQL_URL, {
//   dialect: 'mysql',
//   logging: true
// });

const sequelize = new Sequelize(process.env.MYSQL_DB, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
  host: process.env.MYSQL_HOST,
  dialect: 'mysql',
  logging: true
});

// const sequelize = new Sequelize('shoppingCart', 'root', 'fishDogHouse109@!', {
//   host: '167.99.111.165',
//   dialect: 'mysql',
//   logging: true
// });

module.exports = sequelize;