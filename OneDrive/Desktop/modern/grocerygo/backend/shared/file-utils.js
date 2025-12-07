const fs = require("fs");

/**
 * Reads a JSON file and parses its content.
 * @param {string} filename - The path to the JSON file to read.
 */
async function readFile(filename) {
  try {
    const file = fs.readFileSync(filename, "utf-8");
    return JSON.parse(file);
  } catch (error) {
    throw new Error(`Couldn't read file ${filename}`);
  }
}

/**
 * Writes updated data to a JSON file.
 * @param {string} filename - The path to the JSON file to write to.
 */
async function writeToFile(filename, updated) {
  try {
    const data = JSON.stringify(updated, null, 2);
    fs.writeFileSync(filename, data, "utf-8");
  } catch (error) {
    throw new Error(`Couldn't write into file ${filename}`);
  }
}

module.exports = { readFile, writeToFile };
