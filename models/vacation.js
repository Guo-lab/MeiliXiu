const mongoose = require('mongoose')

const vacationSchema = mongoose.Schema({
    name: String,
    slug: String,
    category: String,
    description: String,
    location: {
        search: String,
        coordinates: {
            lat: Number,
            lng: Number,
        },
    },
    tags: [String],
    isVisited: Boolean,
    available: Boolean,
    notes: String,
})


const Vacation = mongoose.model('Vacation', vacationSchema)
module.exports = Vacation

