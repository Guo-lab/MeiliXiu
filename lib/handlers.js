const rand      = require('./luckyNumber')
const sendEmail = require('./email')

exports.home        = (req, res) => res.render('home') // default status 304
exports.about       = (req, res) => res.render('about', { rand: rand.getLuckyNumber() })
exports.sectionTest = (req, res) => res.render('section-test')



exports.api = {}

exports.newsletterSignup = (req, res) => {

/* Cookie Test    
    // res.cookie('monster', 'Vampire', { signed: true })
    // const monster = req.signedCookies.monster
    // console.log(monster)
    // res.clearCookie('monster')
*/
/* Session Test
    // req.session.userName = 'Anonymous'
    // const colorScheme = req.session.colorScheme || 'dark'
    // console.log(colorScheme)
    // delete req.session.colorScheme
    // console.log(req.session.userName)
    // console.log(req.session.colorScheme)
*/
    res.render('newsletter-signup', { csrf: 'CSRF token goes here' })
}
exports._newsletterSignupProcess_without_session = (req, res) => {
    console.log('CSRF token (from hidden form field): ' + req.body._csrf)
    console.log('Name (from visible form field): '      + req.body.name)
    console.log('Email (from visible form field): '     + req.body.email)
    res.redirect(303, '/newsletter-signup/thank-you') // app.get('.../thank-you', handlers.newsletterSignupThankYou)
}
exports.newsletterSignupThankYou = (req, res) =>
    res.render('newsletter-signup-thank-you')
//
//
exports.newsletter = (req, res) => {
    res.render('newsletter', { csrf: 'CSRF token (form fetch) goes here' })
}
exports.api.newsletterSignup = (req, res) => {
    console.log('(form fetch) CSRF token (from hidden form field): ' + req.body._csrf)
    console.log('(form fetch) Name (from visible form field): '      + req.body.name)
    console.log('(form fetch) Email (from visible form field): '     + req.body.email)
    res.send({ result: 'success' })
}
//
//
//
//
exports.vacationPhotoRecord = (req, res) => {
    const now = new Date()
    res.render('record/vacation-photo', { year: now.getFullYear(), month: now.getMonth() })
}
exports.vacationPhotoRecordProcess = (req, res, fields, files) => {
    console.log('field data: ', fields)
    console.log('files information: ', files)
    res.redirect(303, '/record/vacation-photo-thank-you') // router in main.js
}
exports.vacationPhotoRecordProcessThankYou = (req, res) => {
    res.render('record/vacation-photo-thank-you') // html rendering
}
//
//
// with fetch
exports.vacationPhotoRecordAjax = (req, res) => {
    const now = new Date()
    res.render('record/vacation-photo-ajax', { year: now.getFullYear(), month: now.getMonth() })
}
exports.api.vacationPhotoRecord = (req, res, fields, files) => {
    console.log('field data: ', fields)
    console.log('files: ', files)
    res.send({ result: 'success' })
}






// official W3C HTML5 email regex:
// https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address

const VALID_EMAIL_REGEX = new RegExp(
    '^[a-zA-Z0-9.!#$%&\'*+\/=?^_`{|}~-]+@' +
    '[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
    '(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$'
)

class NewsletterSignup {
    constructor({ name, email }) 
    {
      this.name = name
      this.email = email
    }
    async save() { }
}

exports.newsletterSignupProcess = (req, res) => {
    const name  = req.body.name || '' 
    const email = req.body.email || ''
    // Verify
    if (!VALID_EMAIL_REGEX.test(email)) {
        req.session.flash = {
            type: 'danger',
            intro: 'Validation error!',
            message: 'The email address you entered was not valid.',
        }
        return res.redirect(303, '/newsletter-signup')
    }
    // Utilize an instance of Customized Class NewsLetterSignup
    new NewsletterSignup({ name, email }).save()
        .then(() => {
            req.session.flash = {
                type: 'success',
                intro: 'Thank you!',
                message: 'You have now been signed up for the newsletter.',
            }
            console.log("signup completed and ready to send email to confirm")
            sendEmail.sendEmail(email, res)
            return res.redirect(303, '/newsletter-signup/thank-you')
        })
        .catch(err => {
            req.session.flash = {
                type: 'danger',
                intro: 'Database error!',
                message: 'Database fails to work; please try again later.',
            }
            return res.redirect(303, '/newsletter-signup')
        })
}






/// ================================================
/// ================= Persistence ==================
/// ================================================

const pathUtils = require('path')
const fs        = require('fs')

/// ===== __dirname/../data/vacation-photos ========
/// Create fs folder
const dataDir           = pathUtils.resolve(__dirname, '..', 'data')
const vacationPhotosDir = pathUtils.join(dataDir, 'vacation-photos')

if(!fs.existsSync(dataDir)) 
    fs.mkdirSync(dataDir)

if(!fs.existsSync(vacationPhotosDir)) 
    fs.mkdirSync(vacationPhotosDir)

/// Promisify: 
/// https://www.cnblogs.com/ikcamp/p/7767818.html 
///
const { promisify } = require('util')
const mkdir         = promisify(fs.mkdir)
const rename        = promisify(fs.rename)
exports.vacationPhotoRecordAjaxFileSystem = (req, res) => {
    const now = new Date()
    console.log(now)
    res.render(
        'record/vacation-photo-ajax-fs-storage', { 
            year: now.getFullYear(), 
            month: now.getMonth() 
        }
    )
}
exports.api.vacationPhotoRecordAjaxFileSystem = async (req, res, fields, files) => {
    const photo = files.photo[0]
    const dir   = vacationPhotosDir + '/' + Date.now()
    const path  = dir + '/' + photo.originalFilename
    
    console.log(photo)
    console.log(path)

    await mkdir(dir)
    await rename(photo.path, path)

    res.send({ result: 'success' })
}


/// MongoDB & Postgres
/// Vacations Page 
const database = require('../database')
exports.listVacations = async (req, res) => {
    
    const vacations = await database.getVacations({ available: true })
    
    const context = {
        vacations: vacations.map(vacation => ({
            name: vacation.name,
            description: vacation.description,
            isVisited: vacation.isVisited,
        }))
    }
    console.log(context.vacations, "in handler.js")
    res.render('vacations', context)
}


exports.notifyWhenVisitedForm = (req, res) =>
    res.render('notify-when-visited', { name: req.query.name })

exports.notifyWhenVisitedProcess = async (req, res) => {
    // Data from Form Submit
    const { email, name } = req.body
    // database.js
    await database.addVacationIsVisitedListener(email, name)
    return res.redirect(303, '/vacations')
}





exports.notFound    = (req, res) => res.render('404')
exports.serverError = (err, req, res, next) => res.render('500')
