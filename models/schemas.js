const mongoose = require('mongoose')

const attendeeSchema = mongoose.Schema({
    weddingId: String,
    name: String,
    email: String,
    mealPreference: String,
    busPreference: String,
    comments: String
})

const weddingSchema = mongoose.Schema({
    weddingId: String,
    coupleName: String,
    description: String,
    image: String,
    date: String
})

const userSchema = mongoose.Schema({
    username: String,
    password: String,
    weddingId: String,
    role: String
})

const User = mongoose.model('User', userSchema);
const Wedding = mongoose.model('Wedding', weddingSchema);
const Attendee = mongoose.model('Attendee', attendeeSchema);

module.exports = { User, Wedding, Attendee };