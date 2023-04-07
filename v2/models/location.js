const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const location = sequelize.define('locations', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    lan: {
      type: DataTypes.STRING
    },
    lon: {
      type: DataTypes.STRING
    },
    address: {
      type: DataTypes.STRING
    },
    pincode: {
      type: DataTypes.STRING
    },
    city: {
      type: DataTypes.STRING
    },
    image_url: {
      type: DataTypes.TEXT,
      get () {
        const url = this.getDataValue('image_url')
        return url ? `${process.env.HOST}${url}` : null
      }
    }
  })

  location.registerRelationships = (models) => {
    location.hasMany(models.appointment, {
      foreignKey: 'location_id'
    })

    location.hasMany(models.doctor_fav, {
      foreignKey: 'location_id'
    })

    // many-to-many relationship with department table
    location.belongsToMany(models.department, {
      through: models.location_has_department
    })
  }

  return location
}
