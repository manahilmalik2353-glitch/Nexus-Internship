const express = require("express");

const {
  scheduleMeeting,
  getMeetings,
  acceptMeeting,
  rejectMeeting,
  deleteMeeting,
} = require("../controllers/meetingController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, scheduleMeeting);
router.get("/", protect, getMeetings);
router.patch("/:id/accept", protect, acceptMeeting);
router.patch("/:id/reject", protect, rejectMeeting);
router.delete("/:id", protect, deleteMeeting);

module.exports = router;