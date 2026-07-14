const Document = require("../models/Document");

const uploadDocument = async (req, res) => {
  try {
    const { title } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Document file is required",
      });
    }

    if (!title) {
      return res.status(400).json({
        message: "Document title is required",
      });
    }

    const document = await Document.create({
      title,
      fileUrl: `/uploads/${req.file.filename}`,
      uploadedBy: req.user._id,
    });

    res.status(201).json({
      message: "Document uploaded successfully",
      document,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ uploadedBy: req.user._id })
      .populate("uploadedBy", "name email role")
      .sort({ createdAt: -1 });

    res.json({
      documents,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getSingleDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id).populate(
      "uploadedBy",
      "name email role"
    );

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    res.json({
      document,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const signDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Signature image is required",
      });
    }

    document.signatureUrl = `/uploads/${req.file.filename}`;
    document.status = "signed";

    await document.save();

    res.json({
      message: "Document signed successfully",
      document,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    await document.deleteOne();

    res.json({
      message: "Document deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  getSingleDocument,
  signDocument,
  deleteDocument,
};