const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const departmentHasDoctor = sequelize.define('department_has_doctor', {
    location_department_id: {
      type: DataTypes.UUID,
      primaryKey: false
    },
    doctor_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    }
  })

  return departmentHasDoctor
}
