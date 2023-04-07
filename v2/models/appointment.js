const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const appointment = sequelize.define('appointments', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    location_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    department_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    doctor_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    appointment_type: {
      type: DataTypes.ENUM,
      values: ['general', 'special', 'digital']
    },
    meeting_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    appointment_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    appointment_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    appointment_duration: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    questionary_answers: {
      type: DataTypes.JSON,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM,
      values: ['pending', 'done', 'cancelled']
    },
    prescription_image_url: {
      type: DataTypes.STRING
    }
  })

  appointment.registerRelationships = (model) => {
    appointment.hasMany(model.lab_report, {
      foreignKey: 'appointment_id'
    })

    appointment.belongsTo(model.location, {
      foreignKey: 'location_id'
    })

    appointment.belongsTo(model.department, {
      foreignKey: 'department_id'
    })

    appointment.belongsTo(model.doctor, {
      foreignKey: 'doctor_id'
    })

    appointment.belongsTo(model.patient, {
      foreignKey: 'patient_id'
    })
  }

  return appointment
}
