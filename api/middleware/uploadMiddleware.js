const util = require("util");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;
const path = require("path");
const fs = require("fs")
const FileModel = require("../models/file"); // Ensure this is correctly required

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Define the directory path where you want to store uploaded files
        const uploadPath = path.join(__dirname, "../resources/static/assets/uploads/");

        // Create the directory if it doesn't exist
        fs.mkdir(uploadPath, { recursive: true }, (err) => {
            if (err) return cb(err);
            cb(null, uploadPath);
        });
    },
    filename: (req, file, cb) => {
        // Generate a unique filename to prevent overwriting
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const sanitizedFilename = uniqueSuffix + "-" + file.originalname.replace(/\s+/g, "-");
        cb(null, sanitizedFilename);
    },
});

let uploadFile = multer({
    storage: storage,
    limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
