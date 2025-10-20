const express = require("express");
const router = express.Router();

const {
  getAllGroups,
  getGroupByID,
  addNewGroup,
  updateExistingGroup,
  deleteGroup,
} = require("../models/group-model");

const { createGroupRules, validateCreateGroup } = require("../middlewares/create-group-rules");
const { loginGroupRules, validateLoginGroup } = require("../middlewares/login-group-rules");

router.get("/groups", async (req, res, next) => {
  try {
    const groups = await getAllGroups();
    res.json(groups || []);
  } catch (error) {
    next(error);
  }
});


router.get("/groups/:id", async (req, res, next) => {
  try {
    const group = await getGroupByID(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });
    res.status(200).json(group);
  } catch (error) {
    next(error);
  }
});


router.post("/groups", createGroupRules, validateCreateGroup, async (req, res, next) => {
  try {
    const newGroup = await addNewGroup(req.body);
    res.status(201).json({ message: "Group created successfully", newGroup });
  } catch (error) {
    next(error);
  }
});

router.put("/groups/:id", async (req, res, next) => {
  try {
    const group = await getGroupByID(Number(req.params.id));
    if (!group) return res.status(404).json({ message: "Group not found" });

    const updated = await updateExistingGroup(Number(req.params.id), req.body);
    res.status(200).json({ message: "Group updated successfully", updated });
  } catch (error) {
    next(error);
  }
});


router.delete("/groups/:id", async (req, res, next) => {
  try {
    const group = await getGroupByID(Number(req.params.id));
    if (!group) return res.status(404).json({ message: "Group not found" });

    const deleted = await deleteGroup(Number(req.params.id));
    res.status(200).json({ message: "Group deleted successfully", deleted });
  } catch (error) {
    next(error);
  }
});


router.post("/groups/login", loginGroupRules, validateLoginGroup, async (req, res, next) => {
  try {
    const { name } = req.body; 
    const groups = await getAllGroups();

    const found = groups.find((g) => g.name.toLowerCase() === name.toLowerCase());
    if (!found) return res.status(404).json({ message: "Group not found" });

    res.status(200).json({ message: "Group joined successfully", group: found });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
