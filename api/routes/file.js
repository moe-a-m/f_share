const express = require("express");
const router = express.Router();
const uploadFile = require("../middleware/uploadMiddleware");
const controller = require("../controller/file.controller");

router.post("/upload", uploadFile.single("file"), controller.upload);
router.get("/files", controller.getListFiles);
router.get("/files/:name", controller.download);
router.delete("/files/:name", controller.remove);

module.exports = router;
