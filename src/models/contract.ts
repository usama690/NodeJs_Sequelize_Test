import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Contract extends Model {
  public id!: number;
  public terms!: string;
  public status!: string;
  public ClientId!: number;
  public ContractorId!: number;
}

Contract.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    terms: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('new', 'in_progress', 'terminated'),
      allowNull: false,
    },
    ClientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ContractorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Contract',
    tableName: 'contracts',
  }
);

export default Contract;
