const config = require('config')
const multer = require('multer')
const reportService = require('./reports.service')
const { v4: uuidv4 } = require('uuid')
const { MulterError } = require('multer')
const { InvalidPayload } = require('../../utils/customErrors')

const uploadReport = async (req, res, next) => {
  try {
    // multer storage config
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, config.get('modules.reports.lab.upload_location'))
      },
      filename: (req, file, cb) => {
        const filetype = file.mimetype.split('/')
        const uniqueFileName = uuidv4() + '.' + filetype[1]
        cb(null, uniqueFileName)
      }
    })

    // schema validation
    const fileFilter = (req, file, cb) => {
      const filetype = file.mimetype.split('/')[1]
      if (config.get('modules.reports.lab.allowed_file_types').includes(filetype)) {
        cb(null, true)
      } else {
        cb(new InvalidPayload(`One of the uploaded file type is not allowed. Allowed types are : ${config.get('modules.reports.lab.allowed_file_types')}`), false)
      }
    }
    // file limit
    const limits = {
      fileSize: 2000000 // 2 mb image size limit
    }

    // attempting upload
    const upload = multer({ storage, fileFilter, limits }).array('reportFiles')
    upload(req, res, async (err) => {
      if (err instanceof MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new InvalidPayload('One of the uploaded file size is grater then 2 MB.'))
        } else {
          return next(err)
        }
      } else if (!req.files) {
        return next(new InvalidPayload('No reports are supplied in "reports" field'))
      } else {
        try {
          // on successful upload
          const isValidRequest = isUploadReportRequestValid(req.body, req.files)
          if (isValidRequest) {
            const uploadedReport = await reportService.addReport(req.body, req.files)
            res.status(200).json({
              message: 'Reports added',
              data: {
                report: uploadedReport
              }
            })
          }
        } catch (err) {
          next(err)
        }
      }
    })
  } catch (err) {
    next(err)
  }
}

const isUploadReportRequestValid = (reportData, reportFiles) => {
  if (reportData.patientId && reportData.appointmentId && reportData.reportName && reportFiles) {
    return true
  } else {
    reportFiles.forEach(file => {
      removeReport(file.path)
    })
    throw new InvalidPayload('Invalid payload. Check for missing required params or invalid param data types')
  }
}

const removeReport = (reportPath) => {
  reportService.removeReportFile(reportPath)
}

const updateReport = (req, res, next) => {
  try {
    // multer storage config
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, config.get('modules.reports.lab.upload_location'))
      },
      filename: (req, file, cb) => {
        const filetype = file.mimetype.split('/')
        const uniqueFileName = uuidv4() + '.' + filetype[1]
        cb(null, uniqueFileName)
      }
    })

    // schema validation
    const fileFilter = (req, file, cb) => {
      const filetype = file.mimetype.split('/')[1]
      if (config.get('modules.reports.lab.allowed_file_types').includes(filetype)) {
        cb(null, true)
      } else {
        cb(new InvalidPayload(`One of the uploaded file type is not allowed. Allowed types are : ${config.get('modules.reports.lab.allowed_file_types')}`), false)
      }
    }
    // file limit
    const limits = {
      fileSize: 2000000 // 2 mb image size limit
    }

    // attempting upload
    const upload = multer({ storage, fileFilter, limits }).array('reportFiles')
    upload(req, res, async (err) => {
      if (err instanceof MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new InvalidPayload('One of the uploaded file size is grater then 2 MB.'))
        } else {
          return next(err)
        }
      } else if (!req.files) {
        return next(new InvalidPayload('No reports are supplied in "reports" field'))
      } else {
        try {
          // on successful upload
          if (req.params.reportId) {
            req.body.reportId = req.params.reportId
            const updatedReport = await reportService.updateReport(req.body, req.files)
            res.status(200).json({
              message: 'Reports updated',
              data: {
                report: updatedReport
              }
            })
          } else {
            req.files.forEach(file => {
              removeReport(file.path)
            })
            next(new InvalidPayload('Missing report id'))
          }
        } catch (err) {
          req.files.forEach(file => {
            removeReport(file.path)
          })
          next(err)
        }
      }
    })
  } catch (err) {
    next(err)
  }
}

const getReports = async (req, res, next) => {
  try {
    const report = await reportService.getReports(req.patient.id)
    res.status(200).json({
      message: 'Report listing',
      data: {
        report
      }
    })
  } catch (err) {
    next(err)
  }
}

const deleteReport = async (req, res, next) => {
  try {
    if (req.params.reportId) {
      await reportService.deleteReport(req.params.reportId)
      res.status(200).json({
        message: 'Report deleted'
      })
    } else {
      throw new InvalidPayload('Missing report id in request url')
    }
  } catch (err) {
    next(err)
  }
}

// module level error handler
const reportModuleErrorHandler = (err, req, res, next) => {
  console.log(err)
  switch (err.name) {
    case 'DbError':
      res.status(400).json({
        error: err.message
      })
      break
    case 'SequelizeDatabaseError':
      res.status(400).json({
        error: err.message
      })
      break
    case 'MulterError':
      res.status(400).json({
        error: err.message
      })
      break
    default:
      next(err)
  }
}

module.exports = {
  uploadReport,
  getReports,
  updateReport,
  deleteReport,
  reportModuleErrorHandler
}
