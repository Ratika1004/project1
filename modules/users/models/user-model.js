const { readFile, writeToFile } = require("../../../shared/file-utils");
const { getGroupByID } = require("../../groups/models/group-model");

const filePath = "./data/users.json";

// Get all users
async function getAllUsers() {
  return readFile(filePath);
}

// Get user by ID (needed for groceries validation)
async function getUserByID(userID) {
  if (!userID) throw new Error(`Invalid user ID: ${userID}`);
  const users = await getAllUsers();
  return users.find((u) => u.id === Number(userID));
}

// Get user by email
async function getUserByEmail(email) {
  if (!email) throw new Error("Email is required");
  const users = await getAllUsers();
  return users.find((u) => u.email === email);
}

// Add new user
async function addNewUser(newUser) {
  if (!newUser) throw new Error("Cannot add empty user");

  // Check if email already exists
  const users = await getAllUsers();
  const existing = users.find((u) => u.email === newUser.email);
  if (existing) throw new Error("User with this email already exists");

  // Validate groupId exists
  const group = await getGroupByID(newUser.groupId);
  if (!group) throw new Error(`Group with ID ${newUser.groupId} does not exist`);

  const userToAdd = { id: users.length + 1, ...newUser };
  users.push(userToAdd);
  await writeToFile(filePath, users);
  return userToAdd;
}

module.exports = { getAllUsers, getUserByID, getUserByEmail, addNewUser };
