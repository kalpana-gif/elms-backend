const examService = require("../services/examService");

async function createExam(req, res) {
    try {
        const file = req.file;
        console.log("file",file)
        const exam = await examService.createExam({
            title: req.body.title,
            classroomId: req.body.classroomId,
            date: new Date(req.body.date),
            description: req.body.description,
            fileBuffer: file ? file.buffer : null,
            fileName: file ? file.originalname : null,
            fileType: file ? file.mimetype : null,
        });
        res.json(exam);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getAllExams(req, res) {
    try {
        const exams = await examService.getAllExams();
        res.json(exams);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getExamById(req, res) {
    try {
        const exam = await examService.getExamById(req.params.id);
        if (!exam) return res.status(404).json({ error: "Exam not found" });
        res.json(exam);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function updateExam(req, res) {
    try {
        const file = req.file;
        const exam = await examService.updateExam(req.params.id, {
            title: req.body.title,
            classroomId: req.body.classroomId,
            date: req.body.date ? new Date(req.body.date) : undefined,
            description: req.body.description,
            fileBuffer: file ? file.buffer : null,
            fileName: file ? file.originalname : null,
            fileType: file ? file.mimetype : null,
        });
        res.json(exam);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function deleteExam(req, res) {
    try {
        await examService.deleteExam(req.params.id);
        res.json({ message: "Exam deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function downloadFile(req, res) {
    try {
        const exam = await examService.getExamById(req.params.id);

        if (!exam) {
            return res.status(404).json({ error: "Exam not found" });
        }

        if (!exam.fileData || !exam.fileName) {
            return res.status(404).json({ error: "No file attached to this exam" });
        }

        // Set appropriate headers for file download
        res.setHeader('Content-Type', exam.fileType || 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${exam.fileName}"`);
        res.setHeader('Content-Length', exam.fileData.length);

        // Send the file data
        res.send(exam.fileData);
    } catch (err) {
        console.error('Error downloading file:', err);
        res.status(500).json({
            error: err.message || "Failed to download file"
        });
    }
}

async function getFile(req, res) {
    try {
        const exam = await examService.getExamById(req.params.id);

        if (!exam) {
            return res.status(404).json({ error: "Exam not found" });
        }

        if (!exam.fileData || !exam.fileName) {
            return res.status(404).json({ error: "No file attached to this exam" });
        }

        // Set appropriate headers for inline display
        res.setHeader('Content-Type', exam.fileType || 'application/octet-stream');
        res.setHeader('Content-Disposition', `inline; filename="${exam.fileName}"`);
        res.setHeader('Content-Length', exam.fileData.length);

        // Send the file data
        res.send(exam.fileData);
    } catch (err) {
        console.error('Error getting file:', err);
        res.status(500).json({
            error: err.message || "Failed to get file"
        });
    }
}

async function getViewUrl(req, res) {
    try {
        const exam = await examService.getExamById(req.params.id);

        if (!exam) {
            return res.status(404).json({ error: "Exam not found" });
        }

        if (!exam.fileData || !exam.fileName) {
            return res.status(404).json({ error: "No file attached to this exam" });
        }

        // For this implementation, we'll return the direct file endpoint
        // In a production environment, you might want to generate temporary URLs
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const viewUrl = `${baseUrl}/api/v1/exams/${exam.id}/file`;

        res.json({
            url: viewUrl,
            viewUrl: viewUrl,
            fileName: exam.fileName,
            fileType: exam.fileType
        });
    } catch (err) {
        console.error('Error getting view URL:', err);
        res.status(500).json({
            error: err.message || "Failed to get view URL"
        });
    }
}


module.exports = {
    createExam,
    getAllExams,
    getExamById,
    updateExam,
    deleteExam,
    downloadFile,
    getFile,
    getViewUrl,
};
