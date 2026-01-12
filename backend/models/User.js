const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_name: { type: String, unique: true },
    phone_number: {
        type: String,
        unique: true,
        sparse: true
    },
    phone_prefix: {
        type: String,
        unique: false,
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        sparse: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please fill a valid email address",
        ],
    },
    email_otp: { type: String },
    email_otp_expiry: { type: Date },

    profile_picture: { type: String },
    about: { type: String },
    last_seen: { type: Date },

    is_online: { type: Boolean, default:false },
    is_verified: { type: Boolean, default:false },
    agreed: { type: Boolean, default:false },


}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;

