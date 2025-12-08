const { Router } = require("express");
const mongoose = require("mongoose");
const GroceryModel = require("../models/groceries-model");
const GroupModel = require("../../groups/models/group-model");
const createGroceryRules = require("../middlewares/create-grocery-rules");
const updateGroceryRules = require("../middlewares/update-grocery-rules");
const checkValidation = require("../../../shared/middlewares/check-validation");
const authorize = require("../../../shared/middlewares/authorize");

const groceriesRoute = Router();

groceriesRoute.get("/", authorize(["customer", "admin"]), async (req, res) => {
  try {
    const { search = "", sort_by = "createdAt", sort_order = "desc", limit = 10, page = 1, groupId } = req.query;

    const query = {};
    if (search) query.name = { $regex: search, $options: "i" };
    if (groupId) query.groupId = groupId;

    const user = req.account;
    const isAdmin = user.roles.includes("admin");

    if (!isAdmin && !groupId) {
      query.groupId = { $in: user.groups.map(g => String(g)) };
    }

    const count = await GroceryModel.countDocuments(query);
    const groceries = await GroceryModel.find(query, null, {
      sort: { [sort_by]: sort_order === "asc" ? 1 : -1 },
      limit: parseInt(limit, 10),
      skip: (parseInt(page, 10) - 1) * parseInt(limit, 10),
    });

    res.json({ count, page: parseInt(page, 10), limit: parseInt(limit, 10), data: groceries });
  } catch (error) {
    console.error("Get groceries error:", error);
    res.status(500).json({ message: "Error fetching groceries", error: error.message });
  }
});

groceriesRoute.get("/:id", authorize(["customer", "admin"]), async (req, res) => {
  try {
    const grocery = await GroceryModel.findById(req.params.id);
    if (!grocery) return res.status(404).json({ message: "Grocery not found" });

    const user = req.account;
    const isAdmin = user.roles.includes("admin");

    if (!isAdmin && !user.groups.map(g => String(g)).includes(String(grocery.groupId))) {
      return res.status(403).json({ message: "You are not allowed to view this grocery" });
    }

    res.json(grocery);
  } catch (error) {
    console.error("Get grocery by ID error:", error);
    res.status(400).json({ message: "Invalid ID format", error: error.message });
  }
});

groceriesRoute.post("/", authorize(["customer", "admin"]), createGroceryRules, checkValidation, async (req, res) => {
  try {
    const { name, quantity, groupId, isBought } = req.body;
    const user = req.account;
    const userId = user._id;

    const group = await GroupModel.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const isAdmin = user.roles.includes("admin");
    const members = group.members.filter(m => m != null);
    const isMember = members.map(m => String(m)).includes(String(userId));

    if (!isAdmin && !isMember) return res.status(403).json({ message: "You are not a member of this group" });

    const newGrocery = await GroceryModel.create({
      name,
      quantity,
      addedBy: userId,
      groupId, 
      isBought: !!isBought,
    });

    res.status(201).json(newGrocery);
  } catch (error) {
    console.error("Create grocery error:", error);
    res.status(400).json({ message: "Error creating grocery", error: error.message });
  }
});


groceriesRoute.put("/:id", authorize(["customer", "admin"]), updateGroceryRules, checkValidation, async (req, res) => {
  try {
    const grocery = await GroceryModel.findById(req.params.id);
    if (!grocery) return res.status(404).json({ message: "Grocery not found" });

    const userId = String(req.account._id);
    const isAdmin = req.account.roles.includes("admin");

   
    const group = await GroupModel.findById(grocery.groupId);
    const members = group.members.filter(m => m != null).map(m => String(m));
    const isMember = members.includes(userId);

    if (!isAdmin && !isMember) {
      return res.status(403).json({ message: "You cannot update this grocery" });
    }

    const updateData = {};
    ["name", "quantity", "isBought"].forEach(field => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    const updated = await GroceryModel.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
    res.json(updated);
  } catch (error) {
    console.error("Update grocery error:", error);
    res.status(400).json({ message: "Error updating grocery", error: error.message });
  }
});

groceriesRoute.delete("/:id", authorize(["customer", "admin"]), async (req, res) => {
  try {
    const grocery = await GroceryModel.findById(req.params.id);
    if (!grocery) return res.status(404).json({ message: "Grocery not found" });

    const userId = String(req.account._id);
    const isAdmin = req.account.roles.includes("admin");

    
    const group = await GroupModel.findById(grocery.groupId);
    const members = group.members.filter(m => m != null).map(m => String(m));
    const isMember = members.includes(userId);

    if (!isAdmin && !isMember) {
      return res.status(403).json({ message: "You cannot delete this grocery" });
    }

    await GroceryModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Grocery deleted successfully" });
  } catch (error) {
    console.error("Delete grocery error:", error);
    res.status(400).json({ message: "Invalid ID format", error: error.message });
  }
});

module.exports = groceriesRoute;
