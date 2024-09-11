import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Job extends Model {
  public id!: number;
  public description!: string;
  public price!: number;
  public paid!: boolean;
  public paymentDate!: Date;
  public ContractId!: number;
}

Job.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    paid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ContractId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Job',
    tableName: 'jobs',
  }
);

export default Job;
