const auth = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const Document = require("../models/Document");
const { v4: uuidv4 } = require("uuid");

// ================= STORAGE =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

// ================= UPLOAD =================
router.post("/upload", auth, upload.single("file"), async (req, res) => {
  try {
    const { title, tags, visibility } = req.body;

    const fileName = title || req.file.originalname;

    // 🔍 Find existing versions
    const existingDoc = await Document.findOne({ title: fileName })
      .sort({ version: -1 });

    let newVersion = 1;
    let groupId = uuidv4(); // default new group

    if (existingDoc) {
      newVersion = existingDoc.version + 1;
      groupId = existingDoc.groupId; // ✅ SAME GROUP
    }

    const newDoc = new Document({
      title: fileName,
      originalName: req.file.originalname,
      tags: tags ? tags.split(",").map(t => t.trim()) : [],
      filePath: req.file.path,

      version: newVersion,
      groupId: groupId,          // ✅ IMPORTANT
      owner: req.user.id,
      visibility: visibility || "private"
    });

    await newDoc.save();

    res.json({
      message: "File uploaded with version control",
      data: newDoc
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= SEARCH =================
router.get("/search", auth, async (req, res) => {
  try {
    let keyword = req.query.keyword || "";
    keyword = keyword.trim();

    console.log("🔍 Keyword:", keyword);
    console.log("👤 User:", req.user);

    if (!keyword) return res.json([]);

    const regex = new RegExp(keyword, "i");

    const docs = await Document.find({
      $and: [
        {
          $or: [
            { title: regex },
            { tags: { $in: [regex] } }
          ]
        },
        {
          $or: [
            { visibility: "public" },
            { owner: req.user.id }
          ]
        }
      ]
    }).sort({ createdAt: -1 });

    console.log("📄 Docs found:", docs.length);

    res.json(docs);

  } catch (err) {
    console.error("❌ Search error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;