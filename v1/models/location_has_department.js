const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const locationHasDepartment = sequelize.define('location_has_department', {
    location_department_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    department_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    location_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    }
  })

  locationHasDepartment.registerRelationships = (models) => {
    locationHasDepartment.belongsToMany(models.doctor, {
      through: models.department_has_doctor,
      foreignKey: 'location_department_id'
    })
  }
  return locationHasDepartment
}
