'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Imgs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Imgs.init({
    img: DataTypes.STRING,
    openId: DataTypes.STRING,
	imgName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Imgs',
  });
  return Imgs;
};