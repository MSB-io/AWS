const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING(255), allowNull: false },
  role: { type: DataTypes.ENUM('fan', 'manager', 'admin'), defaultValue: 'fan' },
  avatar: { type: DataTypes.STRING(255), defaultValue: null },
  team_fav: { type: DataTypes.STRING(100), defaultValue: null },
}, { tableName: 'users', timestamps: true, underscored: true });
