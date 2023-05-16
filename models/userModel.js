const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    blockCounter: {
        type: Number,
        default: 0
    },
    blockedAt: {
        type: Number,
        default: null
    }
}, {timestamp : true}); 

module.exports = mongoose.model('User', userSchema);

