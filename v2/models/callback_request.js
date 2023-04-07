const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const callbackRequest = sequelize.define('callback_requests', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    callback_reason_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    preferred_contact_option: {
      type: DataTypes.STRING,
      defaultValue: 'Phone'
    },
    preferred_time: {
      type: DataTypes.DATE
    },
    is_severe: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    remark: {
      type: DataTypes.TEXT
    },
    status: {
      type: DataTypes.ENUM,
      values: ['pending', 'contacted', 'not_reachable']
    }
  })

  callbackRequest.registerRelationships = (model) => {
    callbackRequest.belongsTo(model.callback_reason, {
      foreignKey: 'callback_reason_id'
    })
  }

  return callbackRequest
}
