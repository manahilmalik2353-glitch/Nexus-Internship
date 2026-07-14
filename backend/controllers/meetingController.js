const Meeting = require("../models/Meeting");
const User = require("../models/User");

const scheduleMeeting = async (req, res) => {
  try {
    const { title, investor, entrepreneur, startTime, endTime } = req.body;

    if (!title || !investor || !entrepreneur || !startTime || !endTime) {
      return res.status(400).json({
        message: "Title, investor, entrepreneur, startTime and endTime are required",
      });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= start) {
      return res.status(400).json({
        message: "End time must be after start time",
      });
    }

    const investorUser = await User.findById(investor);
    const entrepreneurUser = await User.findById(entrepreneur);

    if (!investorUser || !entrepreneurUser) {
      return res.status(404).json({
        message: "Investor or entrepreneur not found",
      });
    }

    const conflict = await Meeting.findOne({
      $or: [{ investor }, { entrepreneur }],
      status: { $in: ["pending", "accepted"] },
      startTime: { $lt: end },
      endTime: { $gt: start },
    });

    if (conflict) {
      return res.status(400).json({
        message: "Meeting conflict detected. This time slot is already booked.",
      });
    }

    const meeting = await Meeting.create({
      title,
      investor,
      entrepreneur,
      startTime: start,
      endTime: end,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Meeting scheduled successfully",
      meeting,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({
      $or: [{ investor: req.user._id }, { entrepreneur: req.user._id }, { createdBy: req.user._id }],
    })
      .populate("investor", "name email role")
      .populate("entrepreneur", "name email role")
      .populate("createdBy", "name email role")
      .sort({ startTime: 1 });

    res.json({
      meetings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const acceptMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        message: "Meeting not found",
      });
    }

    meeting.status = "accepted";
    await meeting.save();

    res.json({
      message: "Meeting accepted successfully",
      meeting,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const rejectMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        message: "Meeting not found",
      });
    }

    meeting.status = "rejected";
    await meeting.save();

    res.json({
      message: "Meeting rejected successfully",
      meeting,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        message: "Meeting not found",
      });
    }

    await meeting.deleteOne();

    res.json({
      message: "Meeting deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  scheduleMeeting,
  getMeetings,
  acceptMeeting,
  rejectMeeting,
  deleteMeeting,
};