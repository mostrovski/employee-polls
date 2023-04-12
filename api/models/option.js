"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Option extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Option.belongsTo(models.Poll);
      Option.belongsToMany(models.User, { through: models.Vote });
    }
  }
  Option.init(
    {
      text: DataTypes.STRING,
      pollId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Option",
      tableName: "options",
    }
  );
  return Option;
};
