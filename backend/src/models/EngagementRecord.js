const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('EngagementRecord', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  event_id: { type: DataTypes.INTEGER, allowNull: true },
  action: { type: DataTypes.ENUM('viewed', 'booked', 'shared', 'favourited'), defaultValue: 'viewed' },
  session_minutes: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'engagement_records', timestamps: true, underscored: true });
