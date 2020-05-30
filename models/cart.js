'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('cart', {
  }, {});
  Cart.associate = function(models) {
    // associations can be defined here
    Cart.belongsTo(models.User);
    Cart.belongsToMany(models.Product, { through: 'CartItem'});
  };
  return Cart;
};