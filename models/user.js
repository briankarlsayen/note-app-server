'use strict';
const { Model } = require('sequelize');
const { encrypt, decrypt } = require('../utilities/encryption');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Note, Gauth }) {
      // define association here
      this.hasMany(Note, { foreignKey: 'userId', as: 'notes' });
      this.hasOne(Gauth, { foreignKey: 'userId', as: 'gauth' });
    }
    toJSON() {
      return {
        ...this.get(),
        id: undefined,
        password: undefined,
      };
    }
  }
  User.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      accType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      hooks: {
        // beforeCreate: (user, options) => {
        //   user.name = encrypt(user.name);
        //   user.email = encrypt(user.email);
        // },
        // beforeCreate: (user, options) => {
        //   user.name = encrypt(user.name);
        //   user.email = encrypt(user.email);
        // },
        // beforeFind: (user, options) => {
        //   // console.log('haha');
        //   user.where.email = encrypt(user.where.email);
        //   console.log('haha', user);
        // },
      },
      sequelize,
      tableName: 'users',
      modelName: 'User',
    }
  );
  return User;
};
