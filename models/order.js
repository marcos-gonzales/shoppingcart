'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
  }, {});
  Order.associate = function(models) {
    // associations can be defined here
    Order.belongsTo(models.User);
    Order.belongsToMany(models.Product, { through: 'OrderItem'});
  };
  return Order;
};