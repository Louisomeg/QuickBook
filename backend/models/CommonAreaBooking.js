module.exports = (sequelize, DataTypes) => {
  return sequelize.define('CommonAreaBooking', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    areaName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    purpose: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    groupSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    specialRequirements: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('confirmed', 'cancelled', 'completed'),
      defaultValue: 'confirmed',
      allowNull: false,
    },
    reminderSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
};