const { readFile, writeToFile } = require("../../../shared/file-utils");

const filePath = "./data/groups.json";

// Get all groups
async function getAllGroups() {
  return readFile(filePath);
}

// Get group by ID
async function getGroupByID(groupID) {
  if (!groupID) throw new Error(`Invalid group ID: ${groupID}`);
  const allGroups = await getAllGroups();
  return allGroups.find((g) => g.id === Number(groupID));
}

// Add new group
async function addNewGroup(newGroup) {
  if (!newGroup || !newGroup.name) throw new Error("Name is required to create a group");

  const allGroups = await getAllGroups();
  const groupExists = allGroups.find((g) => g.name === newGroup.name);
  if (groupExists) throw new Error("Group with this name already exists");

  const newItem = {
     id: allGroups.length + 1, 
    name: newGroup.name 
};
  allGroups.push(newItem);

  await writeToFile(filePath, allGroups);
  return newItem;
}

// Update group by ID
async function updateExistingGroup(groupID, updatedData) {
  if (!groupID || !updatedData) throw new Error(`Invalid parameters: ${groupID}, ${updatedData}`);

  const allGroups = await getAllGroups();
  const index = allGroups.findIndex((g) => g.id === Number(groupID));

  if (index < 0) throw new Error(`Group not found with ID: ${groupID}`);
  const updatedGroup = { ...allGroups[index], name: updatedData.name || allGroups[index].name };
  allGroups[index] = updatedGroup;

  await writeToFile(filePath, allGroups);
  return updatedGroup;
}

// Delete group by ID
async function deleteGroup(groupID) {
  if (!groupID) throw new Error("Invalid group ID");

  const allGroups = await getAllGroups();
  const index = allGroups.findIndex((g) => g.id === Number(groupID));

  if (index < 0) throw new Error(`Group not found with ID: ${groupID}`);

  const [deletedGroup] = allGroups.splice(index, 1);
  await writeToFile(filePath, allGroups);
  return deletedGroup;
}

module.exports = {
  getAllGroups,
  getGroupByID,
  addNewGroup,
  updateExistingGroup,
  deleteGroup,
};
