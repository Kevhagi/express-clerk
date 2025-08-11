import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { IExpenseType } from '../types';

class ExpenseType extends Model<IExpenseType> implements IExpenseType {
  public id!: string;
  public name!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

ExpenseType.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'ExpenseType',
    tableName: 'expense_types',
    timestamps: true,
  }
);

export default ExpenseType;
