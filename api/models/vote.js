"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Vote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Vote.init(
    {
      userId: DataTypes.INTEGER,
      optionId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "vote",
      tableName: "votes",
    }
  );
  return Vote;
};
