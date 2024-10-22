const path = require('path');
const uploadFile = require("../middleware/uploadMiddleware");
const fs = require("fs");
const baseUrl = `http://localhost:3001/file/`;
const FileModel = require("../models/file"); // Ensure this is correctly required
const mongoose = require('mongoose');


// file.controller.js

const upload = async (req, res) => {
    try {
        console.log("req.file:", req.file);
        console.log("req.body:", req.body);

        if (!req.file) {
            return res.status(400).send({ message: "Please upload a file!" });
        }

        let tags = [];
        if (req.body.tags) {
            if (typeof req.body.tags === "string") {
                tags = JSON.parse(req.body.tags);
            } else {
                tags = req.body.tags;
            }
        }

        const fileType = req.file.mimetype.startsWith("image/")
            ? "image"
            : req.file.mimetype.startsWith("video/")
                ? "video"
                : "other";

        const baseUrl = `${req.protocol}://${req.get("host")}/file/`;

        const fileData = {
            name: req.file.filename,
            originalName: req.file.originalname,
            url: baseUrl + req.file.filename,
            fileType: fileType,
            uploadDate: new Date(),
            tags: tags,
        };

        const file = new FileModel(fileData);
        await file.save();

        res.status(200).send({
            message: "Uploaded the file successfully: " + req.file.originalname,
            file: fileData,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: `Could not upload the file: ${req.file ? req.file.originalname : "unknown"}. Error: ${err.message}`,
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


const getFileById = async (req, res) => {
    try {
        const fileId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(fileId)) {
            return res.status(400).send({ message: "Invalid file ID" });
        }

        const file = await FileModel.findById(fileId);

        if (!file) {
            return res.status(404).send({ message: "File not found" });
        }

        res.status(200).send(file);
    } catch (err) {
        console.error("Error retrieving file:", err);
        res.status(500).send({
            message: "Error retrieving file. " + err.message,
        });
    }
};

const downloadFileById = async (req, res) => {
    try {
        const fileId = req.params.id;

        // Find the file in the database
        const file = await FileModel.findById(fileId);

        if (!file) {
            return res.status(404).send({ message: "File not found" });
        }

        const filePath = path.join(__dirname, "../resources/static/assets/uploads/", file.name);

        res.download(filePath, file.originalName, (err) => {
            if (err) {
                console.error("Error downloading file:", err);
                res.status(500).send({
                    message: "Could not download the file. " + err.message,
                });
            }
        });
    } catch (err) {
        console.error("Error downloading file:", err);
        res.status(500).send({
            message: "Error downloading file. " + err.message,
        });
    }
};


module.exports = {
    upload,
    getListFiles,
    getFileById, // Add this line
    downloadFileById,
    download,
    remove,
};
