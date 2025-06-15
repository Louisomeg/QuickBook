module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Suggestion', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    attachments: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'in-progress', 'resolved'),
      defaultValue: 'pending',
      allowNull: false,
    },
    adminResponse: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });
};