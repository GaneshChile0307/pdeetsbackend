const admin = require('firebase-admin')
const FCM = require('./fcm-notification')

const serviceAccount = require('../../config/push-notification-key.json')
const certPath = admin.credential.cert(serviceAccount)
const fcm = new FCM(certPath)

const { getAllDeviceTokens } = require('../patient/patient.service')

/**
 * Send push notifcation
 *
 * @param title Title of the notification
 * @param body Notification message
 * @param deviceTokens null for all device, string for single device and array for multiple device
 * @param data An object need have string type of values
 */
const sendPushNotification = async (
  title,
  body,
  deviceTokens = null,
  data = null
) => {
  try {
    const message = data
      ? { notification: { title, body }, data }
      : { notification: { title, body } }

    if (!deviceTokens) {
      deviceTokens = await getAllDeviceTokens()
    }

    if (typeof deviceTokens === 'string') {
      message.token = deviceTokens
      fcm.send(message, responseFromFCM)
    } else if (!deviceTokens || Array.isArray(deviceTokens)) {
      fcm.sendToMultipleToken(message, deviceTokens, responseFromFCM)
    }
  } catch (error) {
    console.log(error)
  }
}

const responseFromFCM = (error, response) => {
  if (error) {
    console.log('error found', error)
  } else {
    console.log('Notification Sent')
  }
}

module.exports = { sendPushNotification }
