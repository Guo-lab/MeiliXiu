const http = require('http')
const port = process.env.PORT || 3000

const server = http.createServer((req, res) => {
    res.writeHead(200, {'Const-Type': 'text/plain'})
    res.end('Hello!')
})

server.listen(port, () => console.log(`server started on port ${port}; ` + 'press Ctrl-C to terminate...'))

// 事件驱动编程
// 正在处理的事件： 一个 HTTP 请求
//               每次创建新的HTTP请求就会调用一次方法中的函数