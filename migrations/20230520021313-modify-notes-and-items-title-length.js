'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('notes', 'title', {
          transaction: t,
        }),
        queryInterface.addColumn(
          'notes',
          'title',
          {
            type: Sequelize.DataTypes.STRING(999),
          },
          { transaction: t }
        ),
        queryInterface.removeColumn('items', 'title', {
          transaction: t,
        }),
        queryInterface.addColumn(
          'items',
          'title',
          {
            type: Sequelize.DataTypes.STRING(999),
          },
          { transaction: t }
        ),
      ]);
    });
  },

  async down(queryInterface, Sequelize) {},
};
