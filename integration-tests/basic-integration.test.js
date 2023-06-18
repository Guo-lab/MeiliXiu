const portfinder = require('portfinder')
const puppeteer  = require('puppeteer')

const app = require('../meilixiu.js')

let server = null
let port   = null

beforeEach(async () => {
    port = await portfinder.getPortPromise()
    server = app.listen(port)
})

afterEach(async () => {
    server.close()
})

test('Home Page LINK to About Page', async () => {
    const browser = await puppeteer.launch({
        headless: 'new',
        // `headless: true` (default) enables old Headless;
        // `headless: 'new'` enables new Headless;
        // `headless: false` enables “headful” mode.
    })
    const page    = await browser.newPage()
    await page.goto(`http://localhost:${port}`)

    await Promise.all([
        page.waitForNavigation(),
        page.click('[data-test-id="about"]'),
    ])
    expect(page.url()).toBe(`http://localhost:${port}/about`)
    await browser.close()
})