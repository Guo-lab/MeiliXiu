const mongoose               = require('mongoose')
const { credentials }        = require('./config')
mongoose.set('strictQuery', true)

const { _connectionString_ } = credentials.mongo





/// ---------------- Connect the Database --------------
if (!_connectionString_) {
    console.error('MongoDB connection string missing!')
    process.exit(1)
}
mongoose.connect(_connectionString_, {useNewUrlParser: true, useUnifiedTopology: true})



const db = mongoose.connection
db.on('error', err => {
    console.error('MongoDB error: ' + err.message)
    process.exit(1)
})
db.once('open', () => 
    console.log('MongoDB connection established')
)
/// -----------------------------------------------------








const Vacation           = require('./models/vacation.js')
// ---- Data Seeds Init (Schema) ----
Vacation.find((err, vacations) => {
    if (err) 
        return console.error(err)
    if (vacations.length) 
        return
  
    new Vacation({
        name: 'Hood River Day Trip',
        slug: 'hood-river-day-trip',
        category: 'Day Trip',
        description: 'Spend a day sailing on the Columbia and enjoying craft beers in Hood River!',
        tags: ['day trip', 'hood river', 'sailing', 'windsurfing', 'breweries'],
        isVisited: true,
        available: true,
    }).save()
    new Vacation({
        name: 'Oregon Coast Getaway',
        slug: 'oregon-coast-getaway',
        category: 'Weekend Getaway',
        description: 'Enjoy the ocean air and quaint coastal towns!',
        tags: ['weekend getaway', 'oregon coast', 'beachcombing'],
        isVisited: false,
        available: true,
    }).save()
    new Vacation({
        name: 'Rock Climbing in Bend',
        slug: 'rock-climbing-in-bend',
        category: 'Adventure',
        description: 'Experience the thrill of climbing in the high desert.',
        tags: ['weekend getaway', 'bend', 'high desert', 'rock climbing'],
        isVisited: true,
        available: false,
        notes: 'The tour guide is currently recovering from a skiing accident.',
    }).save()
})



// process function
const VacationIsVisitedListener = require('./models/vacationIsVisitedListener')




/// =========== Database Abstract Layer Design ===========
// module.exports = {
//     getVacations: async (options = {}) => Vacation.find(options),

//     addVacationIsVisitedListener: async (email, name) => {
//         console.log("Vacation: [", name, "] will notify to <", email, ">")
//         await VacationIsVisitedListener.updateOne(
//             {email},
//             {$push: { names: name }},
//             {upsert: true}
//         )
//     },
// }



















//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const { Pool }             = require('pg')
const _                    = require('lodash')
////const { credentials }      = require('./config')
const { connectionString } = credentials.postgres
const pool                 = new Pool({ connectionString })

module.exports = {

    getVacations: async () => {
        console.log(connectionString)
        const { rows } = await pool.query('SELECT * FROM VACATIONS')
        console.log(rows)
        return rows.map(row => {
            // mapKeys
            // camelCase
            const vacation = _.mapKeys(row, (v, k) => _.camelCase(k))
            vacation.location = {
                search: vacation.locationSearch,
                coordinates: {
                    lat: vacation.locationLat,
                    lng: vacation.locationLng,
                },
            }
            return vacation
        })
    },

    addVacationIsVisitedListener: async (email, name) => {
        console.log(email, name)
        await pool.query(
            'INSERT INTO vacation_is_visited_listeners (email, name) ' +
            'VALUES ($1, $2) ' +
            'ON CONFLICT DO NOTHING',
            [email, name]
        )
    },
}
