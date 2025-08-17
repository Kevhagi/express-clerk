import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.addColumn('brands', 'created_by', {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'system', // Default value for existing records
  });

  await queryInterface.addColumn('brands', 'updated_by', {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'system', // Default value for existing records
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.removeColumn('brands', 'created_by');
  await queryInterface.removeColumn('brands', 'updated_by');
}
