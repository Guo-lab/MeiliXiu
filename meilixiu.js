const express           = require('express')
const expressHandlebars = require('express-handlebars').engine; // https://stackoverflow.com/questions/71083487/typeerror-expresshandlebars-is-not-a-function

const app  = express()
app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main', // --------- {{{WOULD BE REPLACED BY HTML}}}
}))
app.set('view engine', 'handlebars') 

const rand = require('./lib/luckyNumber')


// PORT env setting
const port = process.env.PORT || 3000


// ------------------------------------ [static middleware should be declared with a top priority]
app.use(express.static( // ------------ [Middleware: router for each static asset] what are in '/public' will be provided by static middleware
    __dirname + '/public'
)) 


// ------------------------------------ app.METHOD -> HTTP: get, post, ...
app.get('/', (req, res) => 
    res.render('home')
)
app.get('/about', (req, res) => {
    res.render('about', {rand: rand.getLuckyNumber()})
})


// ------------------------------------ express().use() [Middleware {AFTER router}] to customize 404 and 500   
app.use((req, res) => {
    res.status(404)
    res.render('404')
})
app.use((err, req, res, next) => {
    console.error(err.message)
    res.status(500)
    res.render('500')
})

app.listen(port, () => console.log(
    "|======================================================|" + "\n" + 
    "|                                                      |" + "\n" +
    "|                                                      |" + "\n" +
    `|---    Express started on http://localhost:${port}.    --|` + "\n" +
    '|-----         press Ctrl-C to terminate          -----|' + "\n" +
    "|                                                      |" + "\n" +
    "|                                                      |" + "\n" +
    "|======================================================|"
))
