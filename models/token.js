const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tokenSchema = new Schema({
    token: String,
    uid: Number
});

var tokenModel = mongoose.model('token', tokenSchema);

module.exports = tokenModel;