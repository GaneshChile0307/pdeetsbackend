const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const departmentHasDoctor = sequelize.define('department_has_doctor', {
    location_department_id: {
      type: DataTypes.INTEGER,
      primaryKey: false
    },
    doctor_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }
  })

  return departmentHasDoctor
}
