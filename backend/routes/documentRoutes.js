const express = require("express");
const multer = require("multer");
const path = require("path");

const {
  uploadDocument,
  getDocuments,
  getSingleDocument,
  signDocument,
  deleteDocument,
} = require("../controllers/documentController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOC, DOCX, PNG, JPG and JPEG files are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
});

router.post("/upload", protect, upload.single("document"), uploadDocument);
router.get("/", protect, getDocuments);
router.get("/:id", protect, getSingleDocument);
router.patch("/:id/sign", protect, upload.single("signature"), signDocument);
router.delete("/:id", protect, deleteDocument);

module.exports = router;