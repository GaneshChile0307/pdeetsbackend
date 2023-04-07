const mailer = require('nodemailer')

const getEmailTransport = () => {
  return mailer.createTransport({
    host: 'pdeets.de',
    port: 465,
    secure: true,
    tls: { rejectUnauthorized: false },
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASSWORD
    }
  })
}

const sendEmail = async (receiverEmailId, subject, html) => {
  const gmailMailer = getEmailTransport()
  await gmailMailer.sendMail({
    from: process.env.EMAIL_ID,
    to: receiverEmailId,
    subject,
    html
  })
  return true
}

module.exports = {
  sendEmail
}
