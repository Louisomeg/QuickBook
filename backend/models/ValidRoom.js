module.exports = (sequelize, DataTypes) => {
  return sequelize.define('ValidRoom', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    roomNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });
};