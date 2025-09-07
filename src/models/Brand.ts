import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import { IBrand } from '../types/index.js';

class Brand extends Model<IBrand> implements IBrand {
  public id!: string;
  public name!: string;
  public created_by!: string;
  public updated_by!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Brand.init(
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
    modelName: 'Brand',
    tableName: 'brands',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default Brand;
