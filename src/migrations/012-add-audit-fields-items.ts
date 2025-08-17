import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.addColumn('items', 'created_by', {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'system', // Default value for existing records
  });

  await queryInterface.addColumn('items', 'updated_by', {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'system', // Default value for existing records
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.removeColumn('items', 'created_by');
  await queryInterface.removeColumn('items', 'updated_by');
}
