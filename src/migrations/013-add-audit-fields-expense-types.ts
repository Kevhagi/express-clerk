import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.addColumn('expense_types', 'created_by', {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'system', // Default value for existing records
  });

  await queryInterface.addColumn('expense_types', 'updated_by', {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'system', // Default value for existing records
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.removeColumn('expense_types', 'created_by');
  await queryInterface.removeColumn('expense_types', 'updated_by');
}
