const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    // Reference to the user who uploaded the file (optional)
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Set to true if you require authentication for uploads
    },
    name: { // Updated field name to match the controller code
        type: String,
        required: true
    },
    url: { // Updated field name to match the controller code
        type: String,
        required: true
    },
    fileType: {
        type: String,
        enum: ['image', 'video', 'other'], // Added 'other' for additional file types
        required: true
    },
    uploadDate: { // Changed from 'uploadTime' to 'uploadDate' for consistency
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
