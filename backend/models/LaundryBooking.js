module.exports = (sequelize, DataTypes) => {
  return sequelize.define('LaundryBooking', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    machineId: {
      type: DataTypes.UUID,
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