import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { ITransactionItem } from '../types';

class TransactionItem extends Model<ITransactionItem> implements ITransactionItem {
  public id!: string;
  public transaction_id!: string;
  public item_id!: string;
  public unit_price!: number;
  public qty: number;
  public subtotal!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

TransactionItem.init(
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
    item_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'items',
        key: 'id',
      },
    },
    unit_price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    modelName: 'TransactionItem',
    tableName: 'transaction_items',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default TransactionItem;
