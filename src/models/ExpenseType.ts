import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { IExpenseType } from '../types';

class ExpenseType extends Model<IExpenseType> implements IExpenseType {
  public id!: number;
  public name!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ExpenseType.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
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
