const path = require('path');
const uploadFile = require("../middleware/uploadMiddleware");
const fs = require("fs");
const baseUrl = `http://localhost:3001/file/`;
const FileModel = require("../models/file"); // Ensure this is correctly required


const upload = async (req, res) => {
    try {
        await uploadFile(req, res);

        if (req.file == undefined) {
            return res.status(400).send({ message: "Please upload a file!" });
        }

        // Extract tags from the request body
        let tags = [];
        if (req.body.tags) {
            if (typeof req.body.tags === "string") {
                tags = JSON.parse(req.body.tags);
            } else {
                tags = req.body.tags;
            }
        }

        // Determine the file type
        const fileType = req.file.mimetype.startsWith('image/') ? 'image' :
            req.file.mimetype.startsWith('video/') ? 'video' : 'other';

        // Create a file metadata object
        const fileData = {
            user: req.user ? req.user._id : null, // Assuming you have user authentication
            name: req.file.originalname,
            url: baseUrl + req.file.filename,
            fileType: fileType,
            uploadDate: new Date(),
            tags: tags,
            views: 0,
            sharedLink: null // Set this if you generate shareable links
        };

        // Save file metadata to the database
        const file = new File(fileData);
        await file.save();

        res.status(200).send({
            message: "Uploaded the file successfully: " + req.file.originalname,
            file: fileData,
        });
    } catch (err) {
        console.log(err);

        if (err.code == "LIMIT_FILE_SIZE") {
            return res.status(500).send({
                message: "File size cannot be larger than 2MB!",
            });
        }

        res.status(500).send({
            message: `Could not upload the file: ${req.file ? req.file.originalname : 'unknown'}. Error: ${err.message}`,
        });
    }
};


const getListFiles = async (req, res) => {
    try {
        const files = await FileModel.find().sort({ uploadDate: -1 });

        res.status(200).send(files);
    } catch (err) {
        res.status(500).send({
            message: "Unable to retrieve files!",
        });
    }
};

const download = async (req, res) => {
    try {
        const fileName = req.params.name;

        // Find the file in the database
        const file = await FileModel.findOne({ name: fileName });
        if (!file) {
            return res.status(404).send({ message: "File not found" });
        }

        const filePath = __dirname + "/resources/static/assets/uploads/" + fileName;

        res.download(filePath, fileName, (err) => {
            if (err) {
                res.status(500).send({
                    message: "Could not download the file. " + err,
                });
            }
        });
    } catch (err) {
        res.status(500).send({
            message: "Error downloading file. " + err,
        });
    }
};

const remove = async (req, res) => {
    try {
        const fileName = req.params.name;

        // Delete the file from the database
        const file = await FileModel.findOneAndDelete({ name: fileName });
        if (!file) {
            return res.status(404).send({ message: "File not found" });
        }

        // Delete the file from the file system
        const filePath = __basedir + "/resources/static/assets/uploads/" + fileName;
        fs.unlink(filePath, (err) => {
            if (err) {
                return res.status(500).send({
                    message: "Could not delete the file. " + err,
                });
            }

            res.status(200).send({
                message: "File is deleted.",
            });
        });
    } catch (err) {
        res.status(500).send({
            message: "Error deleting file. " + err,
        });
    }
};

module.exports = {
    upload,
    getListFiles,
    download,
    remove,
};
