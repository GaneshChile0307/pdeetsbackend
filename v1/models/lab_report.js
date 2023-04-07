const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const labReports = sequelize.define('lab_reports', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    patient_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    appointment_id: {
      type: DataTypes.UUID,
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
