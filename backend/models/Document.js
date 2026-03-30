const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({

  // 📄 BASIC INFO
  title: {
    type: String,
    required: true,
    trim: true
  },

  userName: {
    type: String
  },

  filePath: {
    type: String,
    required: true
  },

  // 📌 ORIGINAL FILE NAME (for version tracking)
  originalName: {
    type: String,
    required: true
  },

  // 🏷 TAGS
  tags: {
    type: [String],
    default: []
  },

  // 🔢 VERSION
  version: {
    type: Number,
    default: 1
  },

  // 🔗 GROUPING (IMPORTANT FOR VERSION CONTROL)
  groupId: {
    type: String,
    required: true
  },

  // 👤 OWNER
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // 🔐 VISIBILITY
  visibility: {
    type: String,
    enum: ["public", "private"],
    default: "private"
  },

  // ⭐ FAVORITE (OPTIONAL)
  isFavorite: {
    type: Boolean,
    default: false
  },

  // 📅 CREATED DATE
  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Document", documentSchema);