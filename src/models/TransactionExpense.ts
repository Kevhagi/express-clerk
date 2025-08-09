import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { ITransactionExpense } from '../types';

class TransactionExpense extends Model<ITransactionExpense> implements ITransactionExpense {
  public id!: number;
  public transaction_id!: number;
  public expense_type_id!: number;
  public amount!: number;
  public notes?: string;
  public subtotal!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TransactionExpense.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    transaction_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'transactions',
        key: 'id',
      },
    },
    expense_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'expense_types',
        key: 'id',
      },
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    subtotal: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'TransactionExpense',
    tableName: 'transaction_expenses',
    timestamps: true,
  }
);

export default TransactionExpense;
