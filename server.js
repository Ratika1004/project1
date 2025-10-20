const express = require("express");
require("dotenv").config();
const port = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME || "localhost";
const server = express();


server.use(express.json());

const groupsRouter = require("./modules/groups/routes/group-routes");
const groceriesRouter = require("./modules/groceries/routes/groceries-routes");
const usersRouter = require("./modules/users/routes/user-routes");

server.use(groceriesRouter);
server.use(usersRouter);
server.use(groupsRouter);

server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

server.use((req, res) => {
  res.status(404).send(`404! ${req.method} ${req.path} Not Found.`);
});

server.listen(port, hostname, (error) => {
  if (error) console.log(error.message);
  else console.log(`Server running on http://${hostname}:${port}`);
});
