'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Note }) {
      // define association here
      this.belongsTo(Note, { foreignKey: 'noteId', as: 'note' })
    }
    toJSON() {
      return { ...this.get(), id: undefined, noteId: undefined}
    }
  }
  Item.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    checked: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
  }, {
    sequelize,
    tableName: "items",
    modelName: 'Item',
  });
  return Item;
};