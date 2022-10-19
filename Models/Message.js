//requiring mongoose

const mongoose  = require('mongoose');


const MessageSchema = new mongoose.Schema({
    userID: {type: Number, unique:true},
    recipientID: {type: String, required: true},
    message: {type: String},

},{timestamps: true});


module.exports = mongoose.model('message', MessageSchema);