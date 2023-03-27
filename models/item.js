'use strict';
const { Model } = require('sequelize');
const { encrypt, decrypt } = require('../utilities/encryption');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Note, Preview }) {
      // define association here
      this.belongsTo(Note, { foreignKey: 'noteId', as: 'note' });
      this.hasOne(Preview, { foreignKey: 'itemId', as: 'preview' });
    }
    toJSON() {
      return {
        ...this.get(),
        id: undefined,
        noteId: undefined,
      };
    }
  }
  Item.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      refId: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          this.setDataValue('title', encrypt({ data: value }));
        },
        get() {
          return decrypt({ data: this.getDataValue('title') });
        },
      },
      body: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      checked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      tableName: 'items',
      modelName: 'Item',
    }
  );

  return Item;
};
