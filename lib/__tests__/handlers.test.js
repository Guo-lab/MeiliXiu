const handlers = require("../handlers")


test('Home Page Renders', () => {
    const req = {}
    const res = { render: jest.fn() }
    
    handlers.home(req, res)
    expect(res.render.mock.calls.length).toBe(1)
    expect(res.render.mock.calls[0][0]).toBe('home') // [第一次调用][第一个参数]
})

test('About Page Renders With Rand', () => {
    const req = {}
    const res = { render: jest.fn() }
    
    handlers.about(req, res)
    expect(res.render.mock.calls.length).toBe(1)
    expect(res.render.mock.calls[0][0]).toBe('about') 
    expect(res.render.mock.calls[0][1]).toEqual(
        expect.objectContaining({
            rand: expect.stringMatching(/\d/)
        })
    )        
})

test('404 Page Renders', () => {
    const req = {}
    const res = { render: jest.fn() }
    
    handlers.notFound(req, res)
    expect(res.render.mock.calls.length).toBe(1)
    expect(res.render.mock.calls[0][0]).toBe('404') // [第一次调用][第一个参数]
})

test('500 Page Renders', () => {
    const req = {}
    const res = { render: jest.fn() }
    // 服务器错误处理函数接受4个参数，需要提供更多，模拟对象
    const err = new Error("Error Occurs")
    const next = jest.fn()

    handlers.serverError(err, req, res, next)
    expect(res.render.mock.calls.length).toBe(1)
    expect(res.render.mock.calls[0][0]).toBe('500') // [第一次调用][第一个参数]
})
