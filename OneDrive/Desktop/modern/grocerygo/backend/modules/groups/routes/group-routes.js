const { Router } = require("express");
const GroupModel = require("../models/group-model");
const UserModel = require("../../users/models/user-model"); 
const createGroupRules = require("../middlewares/create-group-rules");
const joinGroupRules = require("../middlewares/join-group-rules");
const checkValidation = require("../../../shared/middlewares/check-validation");
const authorize = require("../../../shared/middlewares/authorize");

const router = Router();

router.get("/", authorize(["admin"]), async (req, res) => {
  try {
    const groups = await GroupModel.find().populate("owner", "name email").populate("members", "name email");
    res.json(groups);
  } catch (err) {
    console.error("Get all groups error:", err);
    res.status(500).json({ errorMessage: "Could not fetch groups" });
  }
});

async function generateUniqueCode() {
  const maxAttempts = 5;
  for (let i = 0; i < maxAttempts; i++) {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const exists = await GroupModel.findOne({ code });
    if (!exists) return code;
  }
  return `G${Date.now().toString(36).slice(-6).toUpperCase()}`;
}

router.post("/", authorize(["customer", "admin"]), createGroupRules, checkValidation, async (req, res) => {
  try {
    const { name } = req.body;
    const ownerId = req.account._id;

    const code = await generateUniqueCode();

    const group = await GroupModel.create({
      name,
      code,
      owner: ownerId,
      members: [ownerId],
    });

      await UserModel.findByIdAndUpdate(ownerId, { $addToSet: { groups: group._id } });

    res.status(201).json(group);
  } catch (err) {
    console.error("Create group error:", err);
    res.status(500).json({ errorMessage: "Could not create group", detail: err.message });
  }
});

router.post("/join", authorize(["customer", "admin"]), joinGroupRules, checkValidation, async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.account._id;

    const group = await GroupModel.findOne({ code });
    if (!group) return res.status(404).json({ errorMessage: "Group not found" });

    if (group.members.some((m) => String(m) === String(userId))) {
      return res.status(409).json({ errorMessage: "You are already a member of this group" });
    }

    group.members.push(userId);
    await group.save();


    await UserModel.findByIdAndUpdate(userId, { $addToSet: { groups: group._id } });

    res.json({ message: "Joined group successfully", group });
  } catch (err) {
    console.error("Join group error:", err);
    res.status(500).json({ errorMessage: "Could not join group" });
  }
});

router.get("/my", authorize(["customer", "admin"]), async (req, res) => {
  try {
    const userId = req.account._id;
    const groups = await GroupModel.find({ members: userId }).populate("owner", "name email");
    res.json(groups);
  } catch (err) {
    console.error("Get groups error:", err);
    res.status(500).json({ errorMessage: "Could not fetch groups" });
  }
});

router.get("/:id", authorize(["customer", "admin"]), async (req, res) => {
  try {
    const group = await GroupModel.findById(req.params.id)
      .populate("owner", "name email")
      .populate("members", "name email");
    if (!group) return res.status(404).json({ errorMessage: "Group not found" });

    const userId = req.account._id;
    const isAdmin = req.account.roles.includes("admin");

    if (!isAdmin && !group.members.map(m => String(m._id)).includes(String(userId))) {
      return res.status(403).json({ errorMessage: "You are not a member of this group" });
    }

    res.json(group);
  } catch (err) {
    console.error("Get group by ID error:", err);
    res.status(500).json({ errorMessage: "Could not fetch group" });
  }
});

module.exports = router;
