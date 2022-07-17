'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('sessions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      sid: {
        type: DataTypes.STRING
      },
      // userId: {
      //   type: DataTypes.STRING
      // },
      expires: {
        type: DataTypes.DATE
      },
      data: {
        type: DataTypes.TEXT
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('sessions');
  }
};