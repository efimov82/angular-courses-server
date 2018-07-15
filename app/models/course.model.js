const mongoose = require('mongoose');

const CourseSchema = mongoose.Schema({
    id: Number,
    slug: String,
    author: String,
    dateCreation: Date,
    description: String,
    duration: Number,
    title: String,
    thumbnail: String,
    youtubeId: String,
    topRated: Boolean,
}, {
    timestamps: true
});

module.exports = mongoose.model('Course', CourseSchema);
