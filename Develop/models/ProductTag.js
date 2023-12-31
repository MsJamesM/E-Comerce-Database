const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection.js");

class ProductTag extends Model {}

ProductTag.init(
  {},
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "product_tag",
  }
);

module.exports = ProductTag;
