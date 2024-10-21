const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        enum: ['image', 'video'],
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    uploadTime: {
        type: Date,
        default: Date.now
    },
    tags: [{
        type: String
    }],
    views: {
        type: Number,
        default: 0
    },
    sharedLink: {
        type: String
    }
});

// Method to increment the view count
fileSchema.methods.incrementViews = async function () {
    this.views += 1;
    await this.save();
};

const File = mongoose.model('File', fileSchema);
module.exports = File;
