import Profile from './profile';
import Contract from './contract';
import Job from './job';
import sequelize from '../config/database';

// Define associations
Profile.hasMany(Contract, { foreignKey: 'ClientId', as: 'ClientContracts' });
Profile.hasMany(Contract, { foreignKey: 'ContractorId', as: 'ContractorContracts' });
Contract.belongsTo(Profile, { foreignKey: 'ClientId', as: 'Client' });
Contract.belongsTo(Profile, { foreignKey: 'ContractorId', as: 'Contractor' });
Contract.hasMany(Job, { foreignKey: 'ContractId' });
Job.belongsTo(Contract, { foreignKey: 'ContractId' });



const models = {
  Profile,
  Contract,
  Job,
  sequelize,
};

export default models;
