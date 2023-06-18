const rand = require('./luckyNumber')

exports.home        = (req, res) => res.render('home') // default status 304
exports.about       = (req, res) => res.render('about', { rand: rand.getLuckyNumber() })
exports.sectionTest = (req, res) => res.render('section-test')

exports.notFound    = (req, res) => res.render('404')
exports.serverError = (err, req, res, next) => res.render('500')
