import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import config from '../../config';

let sequelize = new Sequelize(config.db.database, config.db.user, config.db.password, {
  host: config.db.host,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  define: {
    timestamps: false
  },
  logging: false
});
let entities = {};

fs
  .readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== 'index.js')
  .forEach(file => {
    let model = sequelize.import(path.join(__dirname, file));
    entities[model.name] = model;
  });
Object.keys(entities).forEach(modelName => {
  if('associate' in entities[modelName]) {
    entities[modelName].associate(entities);
  }
});

entities.sequelize = sequelize;
entities.Sequelize = Sequelize;
export default entities;

