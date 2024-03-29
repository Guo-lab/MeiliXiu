const express           = require('express')
const expressHandlebars = require('express-handlebars').engine; // https://stackoverflow.com/questions/71083487/typeerror-expresshandlebars-is-not-a-function

const handlers          = require("./lib/handlers")
const weatherMiddleware = require("./lib/middleware/weather")   // weatherMiddleware = async 


require('./database')

const app  = express()
app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main', // --------- {{{WOULD BE REPLACED BY HTML}}}
    helpers: {
        section: function(name, options) {
            if (!this._sections) 
                this._sections = {}
            this._sections[name] = options.fn(this)
            return null
        }
    }

}))
app.set('view engine', 'handlebars') 


// bodyParser for POST HTML form
const bodyParser        = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
//
app.use(bodyParser.json())


const { credentials }   = require('./config')
const cookieParser      = require('cookie-parser')
app.use(cookieParser(credentials.cookieSecret))
//
const expressSession    = require('express-session')
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: credentials.cookieSecret, // cookie signed key for the Session ID
}))



// ==== Email SMTP ====
const nodemailer = require('nodemailer')
// https://www.sendcloud.net/sendSetting/apiuser
// https://www.sendcloud.net/doc/email_v2/code/
const mailTransport = nodemailer.createTransport({ 
    host: 'smtp.sendcloud.net',
    port: 25,
    auth: {
      user: credentials.sendSmtp.user,
      pass: credentials.sendSmtp.password,
    },
})
// ==== Test SMTP ====
const recp_tos = ["rong5hui@163.com"] //["1722270523@qq.com", "1731003698@qq.com", "rong5hui@163.com"] //["2404290928@qq.com", "rong5hui@163.com"]
async function go() {
    try {
        const result = await mailTransport.sendMail({
            from: 'sendcloud@mail.sendcloud.net',
            to: recp_tos.join(', '),
            subject: 'Auto email. Please do not reply.',
            text: 'Welcome!',
            html: '<h1>MeiliXiu Travel</h1>\n<p>Thanks for visiting ' +
                  'us.  <b>We look forward to your next visit!</b>',
            attachments: [
                {
                    filename: 'test.txt',
                    content: 'Hello !'
                },
            ]
        })
        console.log('mail sent successfully: ', result)
    } catch(err) {
        console.log('could not send mail: ' + err.message)
    }
}
// go()


// ==== PORT env setting ====
const port = process.env.PORT || 3000







// ------------------------------------ [static middleware should be declared with a top priority]
app.use(express.static(
    __dirname + '/node_modules/bootstrap/dist' // https://stackoverflow.com/questions/30473993/how-to-use-npm-installed-bootstrap-in-express
)) 
app.use(express.static(
    __dirname + '/node_modules/jquery/dist'
)) 
app.use(express.static( // ------------ [Middleware: router for each static asset] what are in '/public' will be provided by static middleware
    __dirname + '/public'
)) 
app.use(weatherMiddleware)



// Before all router view, flash middleware should be imported
const flashMiddleware = require('./lib/middleware/flash')
app.use(flashMiddleware)










// ------------------------------------ app.METHOD -> HTTP: get, post, ...
app.get('/', handlers.home)
app.get('/about', handlers.about)
app.get('/section-test', handlers.sectionTest)







// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// handlers for browser-based form submission
app.get( '/newsletter-signup',           handlers.newsletterSignup)
app.post('/newsletter-signup/process',   handlers.newsletterSignupProcess)
app.get( '/newsletter-signup/thank-you', handlers.newsletterSignupThankYou)
//
app.get('/newsletter', handlers.newsletter)
app.post('/api/newsletter-signup', handlers.api.newsletterSignup)
//
//
//
const multiparty = require('multiparty')
app.get('/record/vacation-photo', handlers.vacationPhotoRecord)
app.post('/record/vacation-photo/:year/:month', (req, res) => {
    const form = new multiparty.Form()
    form.parse(req, (err, fields, files) => {
        if(err) 
            return res.status(500).send({ error: err.message })
        console.log('got fields: ', fields)
        console.log('and files: ',  files)
        handlers.vacationPhotoRecordProcess(req, res, fields, files)
    })
})
app.get('/record/vacation-photo-thank-you', handlers.vacationPhotoRecordProcessThankYou)
//
app.get('/record/vacation-photo-ajax', handlers.vacationPhotoRecordAjax)
app.post('/api/vacation-photo-record/:year/:month', (req, res) => {
    const form = new multiparty.Form()
    form.parse(req, (err, fields, files) => {
        if(err) 
            return res.status(500).send({ error: err.message })
        handlers.api.vacationPhotoRecord(req, res, fields, files)
    })
})
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++





/// File System
app.get('/record/vacation-photo-ajax-fs-storage', handlers.vacationPhotoRecordAjaxFileSystem)
app.post('/api/vacation-photo-record-fs-storage/:year/:month', (req, res) => {
    const form = new multiparty.Form()
    form.parse(req, (err, fields, files) => {
        if(err) 
            return res.status(500).send({ error: err.message })
        handlers.api.vacationPhotoRecordAjaxFileSystem(req, res, fields, files)
    })
})




/// MongoDB & Postgres
app.get('/vacations', handlers.listVacations)
app.get('/notify-when-visited', handlers.notifyWhenVisitedForm)
app.post('/notify-when-visited', handlers.notifyWhenVisitedProcess)





















// -------------------------------------------------------------------------------------------------------------
// ------------------------------------ express().use() [Middleware {AFTER router}] to customize 404 and 500   
app.use(handlers.notFound)
app.use(handlers.serverError)


if (require.main == module) {
    app.listen(port, () => console.log(
        "|======================================================|" + "\n" + 
        "|                                                      |" + "\n" +
        "|                                                      |" + "\n" +
        `|       Express started on http://localhost:${port}.      |` + "\n" +
        '|              press Ctrl-C to terminate               |' + "\n" +
        "|                                                      |" + "\n" +
        "|                                                      |" + "\n" +
        "|======================================================|" + "\n"
    ))
} else {
    module.exports = app
}
// -------------------------------------------------------------------------------------------------------------
