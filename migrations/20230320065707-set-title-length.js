'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('items', 'title', {
          transaction: t,
        }),
        queryInterface.addColumn(
          'items',
          'title',
          {
            type: Sequelize.DataTypes.STRING('999'),
          },
          { transaction: t }
        ),
        queryInterface.removeColumn('users', 'name', {
          transaction: t,
        }),
        queryInterface.addColumn(
          'users',
          'name',
          {
            type: Sequelize.DataTypes.STRING('999'),
          },
          { transaction: t }
        ),
        queryInterface.removeColumn('users', 'email', {
          transaction: t,
        }),
        queryInterface.addColumn(
          'users',
          'email',
          {
            type: Sequelize.DataTypes.STRING('999'),
          },
          { transaction: t }
        ),
        queryInterface.removeColumn('notes', 'title', {
          transaction: t,
        }),
        queryInterface.addColumn(
          'notes',
          'title',
          {
            type: Sequelize.DataTypes.STRING('999'),
          },
          { transaction: t }
        ),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        // queryInterface.removeColumn('items', 'title', {
        //   transaction: t,
        // }),
        // queryInterface.removeColumn('users', 'name', {
        //   transaction: t,
        // }),
        // queryInterface.removeColumn('users', 'email', {
        //   transaction: t,
        // }),
      ]);
    });
  },
};
