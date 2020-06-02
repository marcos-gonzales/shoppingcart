require('dotenv').config()
const Sequelize = require('sequelize');


// const sequelize = new Sequelize(process.env.MYSQL_URL, {
//   dialect: 'mysql',
//   logging: true
// });


// if(process.env.NODE_ENV === 'production') {
//   const sequelize = new Sequelize(process.env.DB_URL, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
//     host: process.env.DB_HOST,
//     dialect: 'mysql',
//     logging: true
//   });
// } else {
  const sequelize = new Sequelize('tutorial', 'root', 'fishDogHouse109@!', {
    host: 'localhost',
    dialect: 'mysql',
    logging: true
  });
// }



module.exports = sequelize;