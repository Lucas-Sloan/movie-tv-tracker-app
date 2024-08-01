//models/cinema.js
const mongoose = require('mongoose');

const cinemaSchema = new mongoose.Schema({
    title: { type: String, required: true },
    score: { type: Number, required: true, min: 0, max: 10 },
    status: { type: String, enum: ["Completed", "Haven't Completed", "Plan to Watch"], required: true }, // Required
    description: { type: String },
    type: { type: String, enum: ["Movie", "TV Show"], required: true },
    api_key: { type: String }
});

const Cinema = mongoose.model('Cinema', cinemaSchema);

module.exports =  Cinema;