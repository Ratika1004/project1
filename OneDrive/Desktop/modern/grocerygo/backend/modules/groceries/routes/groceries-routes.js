const { Router } = require("express");
const GroceryModel = require("../models/groceries-model");
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
    if (!isAdmin) {
      if (groupId && !user.groups.includes(groupId)) {
        return res.status(403).json({ message: "You are not a member of this group" });
      } else if (!groupId) {
        query.groupId = { $in: user.groups };
      }
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

    if (!isAdmin && !user.groups.includes(String(grocery.groupId))) {
      return res.status(403).json({ message: "You are not allowed to view this grocery" });
    }

    res.json(grocery);
  } catch (error) {
    res.status(400).json({ message: "Invalid ID format", error: error.message });
  }
});


groceriesRoute.post("/", authorize(["customer", "admin"]), createGroceryRules, checkValidation, async (req, res) => {
  try {
    const { name, quantity, groupId, isBought } = req.body;
    const user = req.account;
    const isAdmin = user.roles.includes("admin");

    if (!isAdmin && !user.groups.includes(groupId)) {
      return res.status(403).json({ message: "You are not a member of this group" });
    }

    const newGrocery = await GroceryModel.create({
      name,
      quantity,
      addedBy: user._id,
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

    const user = req.account;
    const isAdmin = user.roles.includes("admin");

    if (!isAdmin && !user.groups.includes(String(grocery.groupId))) {
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

    const user = req.account;
    const isAdmin = user.roles.includes("admin");

    if (!isAdmin && !user.groups.includes(String(grocery.groupId))) {
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
