const mongoose = require('mongoose')

const carSchema = new mongoose.Schema({
    name: { manufacturer: String, model: String },
    year: Number,
    engine: String,
    description: String,
    image: String
})

const Car = mongoose.model('Car', carSchema)
module.exports = Car