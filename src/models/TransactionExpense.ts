import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { ITransactionExpense } from '../types';

class TransactionExpense extends Model<ITransactionExpense> implements ITransactionExpense {
  public id!: string;
  public transaction_id!: string;
  public expense_type_id!: string;
  public amount!: number;
  public notes?: string;
  public subtotal!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

TransactionExpense.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    transaction_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'transactions',
        key: 'id',
      },
    },
    expense_type_id: {
      type: DataTypes.UUID,
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
    created_at: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updated_at: {
      type: DataTypes.DATE,
      field: 'updated_at',
    },
  },
  {
    sequelize,
    modelName: 'TransactionExpense',
    tableName: 'transaction_expenses',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default TransactionExpense;
