'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('previews', 'imageUrl', {
          transaction: t,
        }),
        queryInterface.addColumn(
          'previews',
          'imageUrl',
          {
            type: Sequelize.DataTypes.STRING,
            allowNull: true,
          },
          { transaction: t }
        ),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([]);
    });
  },
};
