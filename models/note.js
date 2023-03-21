'use strict';
const { Model } = require('sequelize');
const { encrypt, decrypt } = require('../utilities/encryption');
module.exports = (sequelize, DataTypes) => {
  class Note extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Item, User }) {
      // define association here
      this.hasMany(Item, { foreignKey: 'noteId', as: 'items' });
      this.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    }
    toJSON() {
      return { ...this.get(), id: undefined, title: decrypt(this.title) };
    }
  }
  Note.init(
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
      tableName: 'notes',
      modelName: 'Note',
    }
  );
  return Note;
};
