'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Note extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Item }) {
      // define association here
      this.hasMany(Item, { foreignKey: 'noteId', as: 'items' })
    }
    toJSON() {
      return { ...this.get(), id: undefined}
    }
  }
  Note.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
  }, {
    sequelize,
    tableName: "notes",
    modelName: 'Note',
  });
  return Note;
};