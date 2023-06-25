const express           = require('express')
const expressHandlebars = require('express-handlebars').engine; // https://stackoverflow.com/questions/71083487/typeerror-expresshandlebars-is-not-a-function

const handlers          = require("./lib/handlers")
const weatherMiddleware = require("./lib/middleware/weather")   // weatherMiddleware = async 


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


// PORT env setting
const port = process.env.PORT || 3000







// ------------------------------------ [static middleware should be declared with a top priority]
app.use(express.static( // ------------ [Middleware: router for each static asset] what are in '/public' will be provided by static middleware
    __dirname + '/public'
)) 
app.use(weatherMiddleware)



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
