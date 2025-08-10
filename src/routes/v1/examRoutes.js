const express = require("express");
const multer = require("multer");
const examController = require("../../controllers/examController");

const router = express.Router();
const upload = multer(); // store in memory for BLOB

router.post("/test", upload.single("file"), examController.createExam);
router.get("/test", examController.getAllExams);
router.get("/:id", examController.getExamById);
router.put("/:id", upload.single("file"), examController.updateExam);
router.delete("/:id", examController.deleteExam);

// File handling routes
router.get("/:id/download", examController.downloadFile);
router.get("/:id/file", examController.getFile);
router.get("/:id/view", examController.getViewUrl);

module.exports = router;
