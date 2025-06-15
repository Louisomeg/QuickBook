module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Machine', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('washer', 'dryer'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('available', 'in-use', 'maintenance'),
      allowNull: false,
      defaultValue: 'available',
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
};