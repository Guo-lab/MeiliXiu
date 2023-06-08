const express           = require('express')

const app  = express()

// PORT env setting
const port = process.env.PORT || 3000


// ------------------------------------ app.METHOD -> HTTP: get, post, ...
app.get('/', (req, res) => { // ------- default status 200
    res.type('text/plain')
    res.send('Travel')
})
app.get('/about', (req, res) => {
    res.type('text/plain')
    res.send('About')
})


// ------------------------------------ express().use() [Middleware {AFTER router}] to customize 404 and 500   
app.use((req, res) => {
    res.type('text/plain')
    res.status(404)
    res.send('404 - Not Found')
})
app.use((err, req, res, next) => {
    console.error(err.message)
    res.type('text/plain')
    res.status(500)
    res.send('500 - Server Error')
})

app.listen(port, () => console.log(`Express started on http://localhost:${port}. ` + '[====== press Ctrl-C to terminate ======]'))
