module.exports = {
  up: (queryInterface, Sequelize) => {
    const createClientsTable = () => queryInterface.createTable('Clients', {
      id: {
        type: Sequelize.STRING(45),
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      secret: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      deleted: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    return Promise.resolve()
      .then(createClientsTable);
  },
  down: (queryInterface) => {
    const dropClientsTable = () => queryInterface.dropTable('Clients');

    return Promise.resolve()
      .then(dropClientsTable);
  },
};