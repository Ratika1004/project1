
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const groceriesRoute = require("./modules/groceries/routes/groceries-routes");
const usersRoute = require("./modules/users/routes/user-routes");
const groupsRoute = require("./modules/groups/routes/group-routes");

const connectDB = require("./shared/middlewares/connect-db");

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connect to MongoDB
app.use(connectDB);


app.use("/groceries", groceriesRoute);
app.use("/users", usersRoute);
app.use("/groups", groupsRoute);

app.use((req, res, next) => {
  res.status(404).send(`404! ${req.method} ${req.path} Not Found.`);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: "Oops! Internal server error!",
    error: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
