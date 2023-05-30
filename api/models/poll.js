"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Poll extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Poll.belongsTo(models.user, { as: "author", foreignKey: "authorId" });
      Poll.hasMany(models.option);
    }
  }
  Poll.init(
    {
      key: DataTypes.STRING,
      authorId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "poll",
      tableName: "polls",
    }
  );
  return Poll;
};
