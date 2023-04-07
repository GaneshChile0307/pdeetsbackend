const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const deviceToken = sequelize.define('device_tokens', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    patient_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    device_token: {
      type: DataTypes.STRING,
      allowNull: false
    }
  })

  return deviceToken
}
