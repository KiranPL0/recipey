const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var recipeSchema = new Schema({
    date_created: Date,
    author: String,
    data: String,  
    title: String,
    id: Number
});

var recipeModel = mongoose.model('recipe', recipeSchema);

module.exports = recipeModel;