import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  // Since the table is empty, we can directly alter the enum type
  await queryInterface.changeColumn('transactions', 'type', {
    type: DataTypes.ENUM('buy', 'sell'),
    allowNull: false,
  });
};

export const down = async (queryInterface: QueryInterface) => {
  // Rollback to old enum values
  await queryInterface.changeColumn('transactions', 'type', {
    type: DataTypes.ENUM('Penjualan', 'Pembelian'),
    allowNull: false,
  });
};
