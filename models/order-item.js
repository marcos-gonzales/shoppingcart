'use strict';
module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('orderItem', {
    qty: DataTypes.INTEGER
  }, {});
  OrderItem.associate = function(models) {
    // associations can be defined here
  };
  return OrderItem;
};