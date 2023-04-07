const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const appointment = sequelize.define('appointments', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    location_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    department_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    doctor_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    patient_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    appointment_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    appointment_duration: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    questionary_answers: {
      type: DataTypes.JSON,
      allowNull: false
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
