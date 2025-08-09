import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { IBrand } from '../types';

class Brand extends Model<IBrand> implements IBrand {
  public id!: number;
  public name!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Brand.init(
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
    modelName: 'Brand',
    tableName: 'brands',
    timestamps: true,
  }
);

export default Brand;
