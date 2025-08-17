import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { IItem } from '../types';

class Item extends Model<IItem> implements IItem {
  public id!: string;
  public brand_id!: string;
  public model_name!: string;
  public ram_gb!: number;
  public storage_gb!: number;
  public display_name!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Item.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    brand_id: {
      type: DataTypes.UUID,
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
      allowNull: true,
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
    modelName: 'Item',
    tableName: 'items',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default Item;
