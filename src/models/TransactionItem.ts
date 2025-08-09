import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { ITransactionItem } from '../types';

class TransactionItem extends Model<ITransactionItem> implements ITransactionItem {
  public id!: number;
  public transaction_id!: number;
  public item_id!: number;
  public unit_price!: number;
  public qty!: number;
  public subtotal!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TransactionItem.init(
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
    item_id: {
      type: DataTypes.INTEGER,
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
  },
  {
    sequelize,
    modelName: 'TransactionItem',
    tableName: 'transaction_items',
    timestamps: true,
  }
);

export default TransactionItem;
