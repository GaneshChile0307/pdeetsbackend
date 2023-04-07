const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const labReports = sequelize.define('lab_reports', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    appointment_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    report_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    generation_date: {
      type: DataTypes.DATE
    },
    report_files: {
      type: DataTypes.JSON
    },
    status: {
      type: DataTypes.ENUM,
      values: ['pending', 'processing', 'available']
    },
    remarks: {
      type: DataTypes.TEXT
    }
  })

  return labReports
}
