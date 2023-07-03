const nodemailer          = require('nodemailer')
const htmlToFormattedText = require('html-to-formatted-text')
const credentials         = require('../config')


const VALID_EMAIL_REGEX = new RegExp(
    '^[a-zA-Z0-9.!#$%&\'*+\/=?^_`{|}~-]+@' +
    '[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
    '(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$'
)

const mailTransport = nodemailer.createTransport({ 
    host: 'smtp.sendcloud.net',
    port: 25,
    auth: {
      user: credentials.credentials.sendSmtp.user,
      pass: credentials.credentials.sendSmtp.password,
    },
})

exports.sendEmail = (email, res) => {
    console.log(email)
    if (!email) 
        throw new Error('Email does not exist.')
    if (!email.match(VALID_EMAIL_REGEX)) 
		throw new Error('Invalid email address.')

    console.log("No Error detected.")
    res.render('email/signup-thank-you', { layout: null, email: email },
        (err, html) => {
            console.log('rendered email: ', html)
            if (err) 
                console.log('error in email template')

            mailTransport.sendMail({
                from: 'sendcloud@mail.sendcloud.net',
                to: email,
                subject: 'Thank You for Signing up',
                html: html,
                text: htmlToFormattedText(html),
            })
            .then(info => {
                console.log('sent! ', info)
            })
            .catch(err => {
                console.error('Unable to send confirmation: ' + err.message)
            })
        }
    )
}