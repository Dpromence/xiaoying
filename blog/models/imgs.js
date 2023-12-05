'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class imgs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  imgs.init({
    img: DataTypes.STRING,
    openId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'imgs',
  });
  return imgs;
};