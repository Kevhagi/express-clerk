import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import { ITransaction, TransactionType } from '../types/index.js';

class Transaction extends Model<ITransaction> implements ITransaction {
  public id!: string;
  public supplier_id?: string;
  public customer_id?: string;
  public type!: TransactionType;
  public total!: number;
  public transaction_date!: string | Date;
  public notes?: string;
  public created_by!: string;
  public updated_by!: string;
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
      type: DataTypes.ENUM('buy', 'sell'),
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    transaction_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'system',
    },
    updated_by: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'system',
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
    modelName: 'Transaction',
    tableName: 'transactions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default Transaction;
