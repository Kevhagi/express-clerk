import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.addColumn('users', 'created_by', {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'system', // Default value for existing records
  });

  await queryInterface.addColumn('users', 'updated_by', {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'system', // Default value for existing records
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.removeColumn('users', 'created_by');
  await queryInterface.removeColumn('users', 'updated_by');
}
