const express = require("express");
const router = express.Router();
const uploadFile = require("../middleware/uploadMiddleware");
const controller = require("../controller/file.controller");

router.post("/upload", uploadFile.single("file"), controller.upload);
router.get("/files", controller.getListFiles);
router.get("/:id", controller.getFileById); // Add this line
router.get("/download/:id", controller.downloadFileById); // Add this line
router.delete("/:id", controller.remove);

module.exports = router;
