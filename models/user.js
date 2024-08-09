const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cinema' }], 
    tv_shows: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cinema' }] 
});


const User = mongoose.model('User', userSchema);

module.exports =  User;