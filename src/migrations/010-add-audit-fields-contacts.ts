import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.addColumn('contacts', 'created_by', {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'system', // Default value for existing records
  });

  await queryInterface.addColumn('contacts', 'updated_by', {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'system', // Default value for existing records
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.removeColumn('contacts', 'created_by');
  await queryInterface.removeColumn('contacts', 'updated_by');
}
