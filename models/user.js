const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    date_created: Date,
    username: String,
    email: String,
    password: String,
    id: Number,
    bio: String
});

var userModel = mongoose.model('users', userSchema);

module.exports = userModel;