const express           = require('express')
const expressHandlebars = require('express-handlebars').engine; // https://stackoverflow.com/questions/71083487/typeerror-expresshandlebars-is-not-a-function
const handlers          = require("./lib/handlers")

const app  = express()
app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main', // --------- {{{WOULD BE REPLACED BY HTML}}}
}))
app.set('view engine', 'handlebars') 

// PORT env setting
const port = process.env.PORT || 3000



// ------------------------------------ [static middleware should be declared with a top priority]
app.use(express.static( // ------------ [Middleware: router for each static asset] what are in '/public' will be provided by static middleware
    __dirname + '/public'
)) 


// ------------------------------------ app.METHOD -> HTTP: get, post, ...
app.get('/', handlers.home)
app.get('/about', handlers.about)

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

