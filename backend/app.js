require("dotenv").config();
const cors = require("cors");
const express = require("express");
const connectToDb = require("./db/db");
const userRouter = require("./routes/user.routes");

const app = express();

connectToDb();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));


app.get("/", (req, res)=>{
    res.send("Hello world");
});
app.use("/users",userRouter);

module.exports = app;