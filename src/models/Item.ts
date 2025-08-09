import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { IItem } from '../types';

class Item extends Model<IItem> implements IItem {
  public id!: number;
  public brand_id!: number;
  public model_name!: string;
  public ram_gb!: number;
  public storage_gb!: number;
  public display_name!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Item.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    brand_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'brands',
        key: 'id',
      },
    },
    model_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ram_gb: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    storage_gb: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    display_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Item',
    tableName: 'items',
    timestamps: true,
  }
);

export default Item;
