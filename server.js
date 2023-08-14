const express = require("express");
const { connectMongoDB } = require("./config/db");
const app = express();
const port = 3000;
const cors = require("cors");
const userRouter = require("./routes/user");

app.use(cors());
app.use(express.urlencoded({ extended: true }));

connectMongoDB(
  "mongodb+srv://anish:1234@cluster0.twvoz.mongodb.net/testing"
).then(console.log("connected"));

app.use("/user", userRouter);

app.listen(port, () => {
  console.log("server is running on " + port);
});
