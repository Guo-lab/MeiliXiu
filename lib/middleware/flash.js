module.exports = (req, res, next) => {
    // If a flash message from session
    res.locals.flash = req.session.flash
    //console.log(res.locals.flash)
    delete req.session.flash
    next()
}