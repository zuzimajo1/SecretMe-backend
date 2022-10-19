
//requiring mongoose

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userID : {type: Number},
    username : {type: String },
    firstname : {type: String},
    lastname: {type: String},
    password: {type: String,},
    email: {type: String},
    admin : {type:Boolean, default: false},
    image : {type: String}
},{timestamps: true},
)

//exporting UserSchema
module.exports = mongoose.model('User', UserSchema);