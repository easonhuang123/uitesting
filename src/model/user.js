const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: String,
    dateCrawled: Date
});
module.exports = mongoose.model('User', userSchema);