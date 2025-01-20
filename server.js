const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const dotenv = require("dotenv").config();
const connectDB = require("./config/dbConnection");
const contactRoutes = require("./routes/contactRoutes");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorHandler");

connectDB();
app.use(express.json());
app.use("/api/contact", contactRoutes);
app.use("/api/auth", userRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
