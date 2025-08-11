import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { ITransaction, TransactionType } from '../types';

class Transaction extends Model<ITransaction> implements ITransaction {
  public id!: string;
  public user_id!: string;
  public supplier_id?: string;
  public customer_id?: string;
  public type!: TransactionType;
  public total!: number;
  public transaction_date!: Date;
  public notes?: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Transaction.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    supplier_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'contacts',
        key: 'id',
      },
    },
    customer_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'contacts',
        key: 'id',
      },
    },
    type: {
      type: DataTypes.ENUM('Penjualan', 'Pembelian'),
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    transaction_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Transaction',
    tableName: 'transactions',
    timestamps: true,
  }
);

export default Transaction;
