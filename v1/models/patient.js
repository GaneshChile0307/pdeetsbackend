const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const patient = sequelize.define('patients', {
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
      type: DataTypes.STRING,
      unique: true
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    gender: {
      type: DataTypes.ENUM,
      values: ['male', 'female', 'other']
    },
    date_of_birth: {
      type: DataTypes.DATE
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image_url: {
      type: DataTypes.TEXT,
      get () {
        const url = this.getDataValue('image_url')
        return url ? `${process.env.HOST}${url}` : null
      }
    },
    last_login: {
      type: DataTypes.DATE
    }
  })

  patient.registerRelationships = (models) => {
    patient.hasMany(models.review, {
      foreignKey: 'patient_id'
    })

    patient.hasMany(models.appointment, {
      foreignKey: 'patient_id'
    })

    patient.hasMany(models.medication_reminder, {
      foreignKey: 'patient_id'
    })

    patient.hasMany(models.callback_request, {
      foreignKey: 'patient_id'
    })

    patient.hasMany(models.lab_report, {
      foreignKey: 'patient_id'
    })

    patient.hasMany(models.device_token, {
      foreignKey: 'patient_id'
    })
  }

  return patient
}
