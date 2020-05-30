'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('product', {
    title: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER
  }, {});
  Product.associate = function(models) {
    // associations can be defined here
    Product.belongsTo(models.User);
  };
  return Product;
};