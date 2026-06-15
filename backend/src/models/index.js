const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'fanengage_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'root',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: process.env.NODE_ENV === 'production' ? 'mysql' : 'sqlite',
    storage: './database.sqlite', // only used for sqlite
    logging: false,
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
  }
);

// Models
const User = require('./User')(sequelize);
const Event = require('./Event')(sequelize);
const Alert = require('./Alert')(sequelize);
const EngagementRecord = require('./EngagementRecord')(sequelize);

// Associations
User.hasMany(EngagementRecord, { foreignKey: 'user_id' });
EngagementRecord.belongsTo(User, { foreignKey: 'user_id' });
Event.hasMany(EngagementRecord, { foreignKey: 'event_id' });
EngagementRecord.belongsTo(Event, { foreignKey: 'event_id' });

module.exports = { sequelize, User, Event, Alert, EngagementRecord };
