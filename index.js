const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");
const slideRoutes = require("./routes/slide");
const userRoutes = require("./routes/user");

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/slide", slideRoutes);
app.get("/", async (req, res) => {
  res.status(200).json("Server is up and running");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  mongoose
    .connect(process.env.MONGO_DB_URI)
    .then(() => {
      console.log("Connected to the database");
    })
    .catch((err) => {
      console.log(err);
    });
});
