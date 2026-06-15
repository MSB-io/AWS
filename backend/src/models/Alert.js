const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('Alert', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  type: { type: DataTypes.ENUM('system', 'security', 'performance', 'event'), defaultValue: 'system' },
  message: { type: DataTypes.TEXT, allowNull: false },
  severity: { type: DataTypes.ENUM('low', 'medium', 'high', 'critical'), defaultValue: 'medium' },
  resolved: { type: DataTypes.BOOLEAN, defaultValue: false },
  source: { type: DataTypes.STRING(100), defaultValue: 'CloudWatch' },
}, { tableName: 'alerts', timestamps: true, underscored: true });
