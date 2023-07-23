const mongoose = require('mongoose')

const vacationIsVisitedListenerSchema = mongoose.Schema({
  email: String,
  names: [String],
})

const VacationIsVisitedListener = mongoose.model('VacationIsVisitedListener', vacationIsVisitedListenerSchema)
module.exports = VacationIsVisitedListener
