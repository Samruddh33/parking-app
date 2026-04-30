const express = require("express");
const mongoose = require("mongoose");
const parkingRoutes = require("./routes/parkingRoutes");

const app = express();
app.use(express.json());
app.use(express.static("public"));
// Logger
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

// Routes
app.use("/api", parkingRoutes);

// DB connection
mongoose.connect("mongodb://127.0.0.1:27017/parking-app")
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

app.listen(3000, () => {
  console.log("Server running on port 3000");
});