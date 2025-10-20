const express = require("express");
const router = express.Router();

const {
  getAllGroceries,
  getGroceryByID,
  addNewGrocery,
  updateExistingGrocery,
  deleteGrocery,
} = require("../models/groceries-model");

const { createGroceryRules, validateCreateGrocery } = require("../middlewares/create-grocery-rules");
const { updateGroceryRules, validateUpdateGrocery } = require("../middlewares/update-grocery-rules");


router.get("/groceries", async (req, res, next) => {
  try {
    const groceries = await getAllGroceries();
    res.json(groceries || []);
  } catch (error) {
    console.error("Error fetching groceries:", error);
    next(error);
  }
});



router.get("/groceries/:id", async (req, res, next) => {
  try {
    const grocery = await getGroceryByID(req.params.id);
    if (!grocery) return res.status(404).json({ message: "Grocery not found" });
    res.status(200).json(grocery);
  } catch (error) {
    next(error);
  }
});

router.post("/groceries", createGroceryRules, validateCreateGrocery, async (req, res, next) => {
  try {
    const newGrocery = await addNewGrocery(req.body);
    res.status(201).json(newGrocery);
  } catch (error) {
    next(error);
  }
});


router.put("/groceries/:id", updateGroceryRules, validateUpdateGrocery, async (req, res, next) => {
  try {
    const grocery = await getGroceryByID(Number(req.params.id));
    if (!grocery) return res.status(404).json({ message: "Grocery not found" });
    const updated = await updateExistingGrocery(Number(req.params.id), req.body);
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
});


router.delete("/groceries/:id", async (req, res, next) => {
  try {
    const grocery = await getGroceryByID(Number(req.params.id));
    if (!grocery) return res.status(404).json({ message: "Grocery not found" });
    const deleted = await deleteGrocery(Number(req.params.id));
    res.status(200).json({ message: "Grocery deleted successfully", deleted });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
