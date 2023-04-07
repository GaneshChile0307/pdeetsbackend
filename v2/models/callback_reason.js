const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const callbackReason = sequelize.define('callback_reasons', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  })

  callbackReason.registerRelationships = (model) => {
    callbackReason.hasMany(model.callback_request, {
      foreignKey: 'callback_reason_id'
    })
  }

  return callbackReason
}
