const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = require('./User')(sequelize, DataTypes);
const ValidRoom = require('./ValidRoom')(sequelize, DataTypes);
const Machine = require('./Machine')(sequelize, DataTypes);
const LaundryBooking = require('./LaundryBooking')(sequelize, DataTypes);
const CommonAreaBooking = require('./CommonAreaBooking')(sequelize, DataTypes);
const Suggestion = require('./Suggestion')(sequelize, DataTypes);
const Notification = require('./Notification')(sequelize, DataTypes);

// Associations
User.hasMany(LaundryBooking, { foreignKey: 'userId' });
LaundryBooking.belongsTo(User, { foreignKey: 'userId' });
Machine.hasMany(LaundryBooking, { foreignKey: 'machineId' });
LaundryBooking.belongsTo(Machine, { foreignKey: 'machineId' });

User.hasMany(CommonAreaBooking, { foreignKey: 'userId' });
CommonAreaBooking.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Suggestion, { foreignKey: 'userId' });
Suggestion.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  ValidRoom,
  Machine,
  LaundryBooking,
  CommonAreaBooking,
  Suggestion,
  Notification,
};