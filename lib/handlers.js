const rand = require('./luckyNumber')


exports.home        = (req, res) => res.render('home') // default status 304
exports.about       = (req, res) => res.render('about', { rand: rand.getLuckyNumber() })
exports.sectionTest = (req, res) => res.render('section-test')



exports.api = {}

exports.newsletterSignup = (req, res) => {
    res.render('newsletter-signup', { csrf: 'CSRF token goes here' })
}
exports.newsletterSignupProcess = (req, res) => {
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




exports.notFound    = (req, res) => res.render('404')
exports.serverError = (err, req, res, next) => res.render('500')
