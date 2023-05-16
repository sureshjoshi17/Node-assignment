const mongoose = require('mongoose');


const authSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: Number,
    createdAt : {
        type : Number,
        default : Date.now()
    }
}) 

module.exports = mongoose.model('Auth', authSchema);

