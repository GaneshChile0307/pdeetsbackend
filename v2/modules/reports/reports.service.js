// model imports
const { db } = require('../../db')

// lib import
const config = require('config')
const axios = require('axios')
const fs = require('fs')

// custom eror
const {
  DatabaseError
} = require('../../utils/customErrors')

const addReport = async (reportData, reportFiles) => {
  try {
    let report = await db.lab_report.create({
      patient_id: reportData.patientId,
      appointment_id: reportData.appointmentId,
      report_name: reportData.reportName,
      generation_date: reportData.generationDate,
      report_files: reportFiles,
      status: reportData.status,
      remarks: reportData.remarks
    })
    report = addReportDownloadUrl(report)
    return report
  } catch (err) {
    reportFiles.forEach((file) => {
      removeReportFile(file.path)
    })
    if (err.name === 'SequelizeForeignKeyConstraintError') {
      throw new DatabaseError('Invalid appointment or patient id')
    }
  }
}

const getReports = async (patientId) => {
  const reportRequest = await axios.get(process.env.KIELSTEIN_API + `/patient/${patientId}/labreports`)
  return reportRequest.data
}

const updateReport = async (reportData, reportFiles) => {
  let report = {}
  if (reportFiles.length > 0) {
    // removing old files
    report = await db.lab_report.findOne({
      where: {
        id: reportData.reportId
      },
      raw: true
    })

    if (report) {
      report.report_files.forEach((file) => {
        removeReportFile(file.path)
      })
    } else {
      throw new DatabaseError('No report found with the provided id or no updated were supplied.')
    }

    // updating data
    let updatedReport = await db.lab_report.update({
      patient_id: reportData.patientId,
      appointment_id: reportData.appointmentId,
      report_name: reportData.reportName,
      generation_date: reportData.generationDate,
      report_files: reportFiles,
      status: reportData.status,
      remarks: reportData.remarks
    }, {
      where: {
        id: reportData.reportId
      },
      returning: true,
      raw: true
    })

    updatedReport = addReportDownloadUrl(updatedReport[1][0])
    return updatedReport
  } else {
    report = await db.lab_report.create({
      patient_id: reportData.patientId,
      appointment_id: reportData.appointmentId,
      report_name: reportData.reportName,
      generation_date: reportData.generationDate,
      status: reportData.status,
      remarks: reportData.remarks
    })

    if (report.length > 0 && report[1]) {
      return report[1][0]
    } else {
      throw new DatabaseError('No report found with the provided id or no updated were supplied.')
    }
  }
}

const deleteReport = async (reportId) => {
  const isDeleted = await db.lab_report.destroy({
    where: {
      id: reportId
    }
  })

  if (!isDeleted) {
    throw new DatabaseError('No report found with the provided id.')
  }
  return true
}

const addReportDownloadUrl = async (report) => {
  const updatedReportFiles = report.report_files.map((file) => {
    file.download_url = process.env.HOST + '/' + config.get('modules.reports.lab.upload_location').replace('public/', '') + '/' + file.filename
    return file
  })
  report.report_files = updatedReportFiles
  return report
}

const removeReportFile = (filePath) => {
  fs.unlinkSync(filePath)
}

module.exports = {
  addReport,
  getReports,
  updateReport,
  deleteReport,
  removeReportFile
}
