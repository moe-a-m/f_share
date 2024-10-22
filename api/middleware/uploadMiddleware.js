const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "../resources/static/assets/uploads/");

        fs.mkdir(uploadPath, { recursive: true }, (err) => {
            if (err) return cb(err);
            cb(null, uploadPath);
        });
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const sanitizedFilename = uniqueSuffix + "-" + file.originalname.replace(/\s+/g, "-");
        cb(null, sanitizedFilename);
    },
});

const uploadFile = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },
});

module.exports = uploadFile;
