const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["investor", "entrepreneur"],
      required: true,
    },

    bio: {
      type: String,
      default: "",
    },

    startupHistory: {
      type: String,
      default: "",
    },

    investmentHistory: {
      type: String,
      default: "",
    },

    preferences: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);