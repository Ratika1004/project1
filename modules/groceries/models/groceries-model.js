const { readFile, writeToFile } = require("../../../shared/file-utils");
const { getUserByID } = require("../../users/models/user-model");
const { getGroupByID } = require("../../groups/models/group-model");

const filePath = "./data/groceries.json";

// Get all groceries
async function getAllGroceries() {
  return readFile(filePath);
}

// Get grocery by ID
async function getGroceryByID(groceryID) {
  if (!groceryID) throw new Error(`Invalid grocery ID: ${groceryID}`);
  const allGroceries = await getAllGroceries();
  return allGroceries.find((item) => item.id === Number(groceryID));
}

// Add a new grocery
async function addNewGrocery(newGrocery) {
  if (!newGrocery) throw new Error("Cannot add an empty grocery item");

  // Validate user
  const user = await getUserByID(newGrocery.addedBy);
  if (!user) throw new Error(`User with ID ${newGrocery.addedBy} does not exist`);

  // Validate group
  const group = await getGroupByID(newGrocery.groupId);
  if (!group) throw new Error(`Group with ID ${newGrocery.groupId} does not exist`);

  const allGroceries = await getAllGroceries();
  const newItem = {
    id: allGroceries.length + 1,
    isBought: false, 
    ...newGrocery,
  };

  allGroceries.push(newItem);
  await writeToFile(filePath, allGroceries);
  return newItem;
}

// Update grocery by ID
async function updateExistingGrocery(groceryID, updatedData) {
  if (!groceryID || !updatedData)
    throw new Error(`Invalid parameters: ${groceryID}, ${updatedData}`);

  const allGroceries = await getAllGroceries();
  const index = allGroceries.findIndex((item) => item.id === Number(groceryID));

  if (index < 0) throw new Error(`Grocery item not found with ID: ${groceryID}`);

  // Validate updated addedBy if provided
  if (updatedData.addedBy) {
    const user = await getUserByID(updatedData.addedBy);
    if (!user) throw new Error(`User with ID ${updatedData.addedBy} does not exist`);
  }

  // Validate updated groupId if provided
  if (updatedData.groupId) {
    const group = await getGroupByID(updatedData.groupId);
    if (!group) throw new Error(`Group with ID ${updatedData.groupId} does not exist`);
  }

  const updatedGrocery = { ...allGroceries[index], ...updatedData };
  allGroceries[index] = updatedGrocery;

  await writeToFile(filePath, allGroceries);
  return updatedGrocery;
}

// Delete grocery by ID
async function deleteGrocery(groceryID) {
  const allGroceries = await getAllGroceries();
  const index = allGroceries.findIndex((item) => item.id === Number(groceryID));

  if (index < 0) throw new Error(`Grocery item not found with ID: ${groceryID}`);

  const [deletedGrocery] = allGroceries.splice(index, 1);
  await writeToFile(filePath, allGroceries);
  return deletedGrocery;
}

module.exports = {
  getAllGroceries,
  getGroceryByID,
  addNewGrocery,
  updateExistingGrocery,
  deleteGrocery,
};
