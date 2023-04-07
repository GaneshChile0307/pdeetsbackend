const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const doctor = sequelize.define('doctors', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING
    },
    phone_number: {
      type: DataTypes.STRING
    },
    address: {
      type: DataTypes.STRING
    },
    pincode: {
      type: DataTypes.STRING
    },
    education: {
      type: DataTypes.STRING
    },
    about: {
      type: DataTypes.TEXT
    },
    doctor_speciality: {
      type: DataTypes.STRING
    },
    licence_no: {
      type: DataTypes.STRING
    },
    experience: {
      type: DataTypes.DOUBLE
    },
    image_url: {
      type: DataTypes.TEXT,
      get () {
        const url = this.getDataValue('image_url')
        return url ? `${process.env.HOST}${url}` : null
      }
    }
  })

  doctor.registerRelationships = (models) => {
    doctor.hasMany(models.review, {
      foreignKey: 'doctor_id'
    })

    doctor.hasMany(models.appointment, {
      foreignKey: 'doctor_id'
    })

    doctor.hasMany(models.doctor_schedule, {
      foreignKey: 'doctor_id'
    })

    doctor.registerRelationships = (models) => {
      doctor.belongsToMany(models.location_has_department, {
        through: models.department_has_doctor,
        foreignKey: 'id'
      })
    }
  }

  return doctor
}
