const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const doctorSchedules = sequelize.define('doctor_schedules', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    doctor_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    appointment_duration: {
      type: DataTypes.INTEGER,
      defaultValue: 30,
      allowNull: false
    }
  })

  return doctorSchedules
}
