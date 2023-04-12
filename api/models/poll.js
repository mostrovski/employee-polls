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
      Poll.belongsTo(models.User, { foreignKey: "authorId" });
      Poll.hasMany(models.Option);
    }
  }
  Poll.init(
    {
      key: DataTypes.STRING,
      authorId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Poll",
      tableName: "polls",
    }
  );
  return Poll;
};
