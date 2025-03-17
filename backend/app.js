const cors = require("cors");
const express = require("express");
const connectToDb = require("./db/db");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user.routes");
const captainRouter = require("./routes/captain.routes");

const app = express();

connectToDb();


app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));


app.get("/", (req, res)=>{
    res.send("Hello world");
});
app.use("/users", userRouter);
app.use("/captains", captainRouter);

module.exports = app;