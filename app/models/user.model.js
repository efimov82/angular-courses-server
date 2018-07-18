const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    slug: String,
    name: String,
    email: String,
    password: String,
    admin: Boolean
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
