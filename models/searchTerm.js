const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const searchTermSchema = new Schema({
    searchVal: String,
    searchDate: Date
}, {timestamps: true});

module.exports = mongoose.model("SearchTerm", searchTermSchema);
