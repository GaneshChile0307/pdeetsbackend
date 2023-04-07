const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const department = sequelize.define('departments', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    image_url: {
      type: DataTypes.TEXT,
      get () {
        const url = this.getDataValue('image_url')
        return url ? `${process.env.HOST}${url}` : null
      }
    }
  })

  department.registerRelationships = (models) => {
    department.hasMany(models.appointment, {
      foreignKey: 'department_id'
    })

    // many-to-many relationship with location table
    department.belongsToMany(models.location, {
      through: models.location_has_department
    })

    // many-to-many relationship with doctor table
    // department.belongsToMany(models.doctor, {
    //   through: models.department_has_doctor
    // })
  }

  return department
}
