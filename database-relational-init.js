const { credentials }      = require('./config')

const { Client, Pool }     = require('pg')
const { connectionString } = credentials.postgres
const client               = new Client({ connectionString })

const createScript = 
`
    CREATE TABLE IF NOT EXISTS vacations (
        name varchar(200) NOT NULL,
        slug varchar(200) PRIMARY KEY,
        category varchar(50),
        description text,
        location_search varchar(100) NOT NULL,
        location_lat double precision,
        location_lng double precision,
        tags jsonb,
        is_visited boolean,
        available boolean,
        notes text
    );
    CREATE TABLE IF NOT EXISTS vacation_is_visited_listeners (
        email varchar(200) NOT NULL,
        name varchar(20) NOT NULL,
        PRIMARY KEY (email, name)
    );
`



const getVacationCount = async client => {
    console.log(connectionString)
    const { rows } = await client.query('SELECT COUNT(*) FROM VACATIONS')
    return Number(rows[0].count)
}


const seedVacations = async client => {
    const sql = 
    `
        INSERT INTO vacations(
            name, slug, category, description, location_search, tags, is_visited, available, notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `
    await client.query(sql, [
        'Hood River Day Trip',
        'hood-river-day-trip',
        'Day Trip',
        'Spend a day sailing on the Columbia and enjoying craft beers in Hood River!',
        'Hood River, Oregon, USA',
        `["day trip", "hood river", "sailing", "windsurfing", "breweries"]`,
        true,
        true,
        null,
    ])
    await client.query(sql, ['Oregon Coast Getaway', 'oregon-coast-getaway', 'Weekend Getaway', 
        'Enjoy the ocean air and quaint coastal towns!', 'Cannon Beach, Oregon, USA', 
        JSON.stringify(['weekend getaway', 'oregon coast', 'beachcombing']), false, true, '',
    ])
    await client.query(sql, ['Rock Climbing in Bend', 'rock-climbing-in-bend', 'Adventure',
        'Experience the thrill of climbing in the high desert.', 'Bend, Oregon, USA',
        JSON.stringify(['weekend getaway', 'bend', 'high desert', 'rock climbing']), 
        true, true, 'The tour guide is currently recovering from a skiing accident.',
    ])
}



client.connect().then(async () => {
    try {
        console.log('creating database schema')
        await client.query(createScript)
        const vacationCount = await getVacationCount(client)
        if(vacationCount === 0) {
            console.log('seeding vacations')
            await seedVacations(client)
        }
        console.log('seeding vacations completed')
        var vacationCnt = await getVacationCount(client)
        console.log(vacationCnt, ' vacations now') 
    } 
    catch(err) {
        console.log('ERROR: could not initialize database')
        console.log(err.message)
    } 
    finally {
        client.end()
    }
})

