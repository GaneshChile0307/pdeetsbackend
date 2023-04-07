const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const deviceToken = sequelize.define('device_tokens', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    device_token: {
      type: DataTypes.STRING,
      allowNull: false
    }
  })

  return deviceToken
}
