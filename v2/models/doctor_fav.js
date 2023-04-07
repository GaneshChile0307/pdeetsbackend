const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const doctorFav = sequelize.define('doctor_fav', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    doctor_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    location_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    department_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  })

  doctorFav.registerRelationships = (model) => {
    doctorFav.belongsTo(model.location, {
      foreignKey: 'location_id'
    })

    doctorFav.belongsTo(model.department, {
      foreignKey: 'department_id'
    })

    doctorFav.belongsTo(model.doctor, {
      foreignKey: 'doctor_id'
    })

    doctorFav.belongsTo(model.patient, {
      foreignKey: 'patient_id'
    })
  }

  return doctorFav
}
