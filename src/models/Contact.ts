import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { IContact } from '../types';

class Contact extends Model<IContact> implements IContact {
  public id!: string;
  public name!: string;
  public phone!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Contact.init(
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
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Contact',
    tableName: 'contacts',
    timestamps: true,
  }
);

export default Contact;
