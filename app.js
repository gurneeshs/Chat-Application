// Internal Imports
const {notFoundHandler,errorHandler} = require("./middlewares/commons/errorHandler");
const loginRouter = require("./router/loginRouter");
const usersRouter = require("./router/usersRouter");
const inboxRouter = require("./router/inboxRouter");

// External Imports
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();
dotenv.config();

// Creater Connection
mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
.then(()=>{console.log("Database connection successful")})
.catch((err)=>{console.log(err)});


// Request Parser
app.use(express.json());
app.use(express.urlencoded({extended:true}));//for form data

// Set View Engine
app.set("view engine", "ejs");

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Parse engine
app.use(cookieParser(process.env.COOKIE_SECRET));

// Routing Setup
app.use("/", loginRouter);
app.use("/users", usersRouter);
app.use("/inbox", inboxRouter);
// Error Handling
// 404 not found
app.use(notFoundHandler);
// common error handler
app.use(errorHandler);

app.listen(3000, ()=>{
    console.log(`App is listening to port ${3000}`)
});