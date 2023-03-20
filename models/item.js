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
        title: decrypt(this.title),
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
      hooks: {
        beforeCreate: (item, options) => {
          item.title = encrypt(item.title);
        },
        beforeUpdate: (item, options) => {
          console.log('item', encrypt(item.title));
          item.title = encrypt(item.title);
        },
      },
      sequelize,
      tableName: 'items',
      modelName: 'Item',
    }
  );

  return Item;
};
