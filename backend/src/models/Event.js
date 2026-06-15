const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('Event', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(200), allowNull: false },
  sport: { type: DataTypes.STRING(100), allowNull: false },
  venue: { type: DataTypes.STRING(200), allowNull: false },
  event_date: { type: DataTypes.DATE, allowNull: false },
  status: { type: DataTypes.ENUM('upcoming', 'live', 'completed', 'cancelled'), defaultValue: 'upcoming' },
  capacity: { type: DataTypes.INTEGER, defaultValue: 50000 },
  tickets_sold: { type: DataTypes.INTEGER, defaultValue: 0 },
  home_team: { type: DataTypes.STRING(100), defaultValue: null },
  away_team: { type: DataTypes.STRING(100), defaultValue: null },
  ticket_price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 499.00 },
}, { tableName: 'events', timestamps: true, underscored: true });
