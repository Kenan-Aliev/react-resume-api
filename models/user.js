const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    email: {type: String, required: true, unique: true},
    username: {type: String, required: true, unique: true},
    password: {type: String},
    githubId: {type: String}
})

module.exports = model('users', userSchema)