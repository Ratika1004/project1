## GROCERYGO

GROCERYGO is a user-friendly app designed to help users manage groceries within groups such as roommates, families, or flatmates. It allows users to add, update, delete items, track who added each item, and mark items as bought to keep everyone organized.

## Table of Contents

Features
Installation
Technologies
Project Structure
Future Enhancements


## features

Group management - create a new group or join existing groups via a unique group ID.
Grocery Management - add , delete , update grocery items.
Track contributions - see who added each item.
purchase tracking - mark item as bought to monitor who bought what.
collaborative - helps groups coordinate groceries efficiently.

## installation
1) Clone the repository
    git clone https://github.com/Ratika1004/project1.git

2) cd grocerygo

3) Install dependencies
    npm install

4) npm start


## technologies
Validation	express-validator
Data Storage	JSON files (temporary data source)
Backend Framework Node.js, Express.js
## project structure 
grocerygo--
|-data/
|- modules/
|  |-users/
|  |        |-routes/
|  |        |-middlewares/
|  |        |-models/
|  |-groceries/
|  |        |-routes/
|  |        |-middlewares/
|  |        |-models/
|  |-groups/
|  |        |-routes/
|  |        |-middlewares/
|  |        |-models/
|-.env
|-node_modules
|-.gitignore
|-shared/
|-package.json
|-package-lock.json
|-server.js


## future enchancements
Integrate a database (MongoDB or PostgreSQL).
Add authentication and user sessions.





