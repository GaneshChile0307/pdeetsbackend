const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const medicationReminder = sequelize.define('medication_reminders', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    patient_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    medicine_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dosage_qty: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    dosage_unit: {
      type: DataTypes.STRING
    },
    dosage_interval: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    dosage_interval_unit: {
      type: DataTypes.STRING,
      allowNull: false
    },
    medication_time: {
      type: DataTypes.JSON,
      allowNull: false
    },
    medication_time_unit: {
      type: DataTypes.STRING
    },
    reminder_time: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    reminder_unit: {
      type: DataTypes.STRING,
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    special_remarks: {
      type: DataTypes.TEXT
    }
  })

  medicationReminder.registerRelationships = (model) => {
    medicationReminder.belongsTo(model.patient, {
      foreignKey: 'patient_id'
    })
  }

  return medicationReminder
}
