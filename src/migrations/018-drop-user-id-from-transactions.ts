import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  // Drop foreign key constraint if named by convention; fallback to removeColumn will drop it implicitly in many dialects
  await queryInterface.removeColumn('transactions', 'user_id');
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.addColumn('transactions', 'user_id', {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  });
};


