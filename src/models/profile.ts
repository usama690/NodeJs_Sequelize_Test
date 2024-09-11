import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Profile extends Model {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public profession!: string;
  public balance!: number;
  public type!: string;
}

Profile.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profession: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    balance: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('client', 'contractor'),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Profile',
    tableName: 'profiles',
  }
);

export default Profile;
