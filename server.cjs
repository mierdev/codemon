// import libraries
const mongoose = require("mongoose");
const express = require("express");

// setup server
const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.json);

// connect to database
mongoose.connect("mongodb://localhost/dbCodemon");
/* 
  normally you put the database path in .env for safety!
  but for ease of use, and since it's running locally, I've put it here

  for reference:

  in .env
    DATABASE_URL=mongodb://localhost/dbCodemon

  in server.js
    import { configDotenv } from "dotenv";
    montgoose.connect(process.env.DATABASE_URL);
*/

// test database connection
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Database of madness has started!"));

// setup routes
const abilitiesRouter = require("./routes/routerAbilities.cjs");
app.use("/abilities", abilitiesRouter);

// render index.ejs
app.get("/", (_, res) => {
  console.log("Fire is starting to spread on your screen!");
  res.render("index");
});

/*
// serve static index.html
app.get("/static", (_, res) => {
  console.log("Fire is spreading on your screen!");
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
*/

// start server
app.listen(3000, () => console.log("Chaos has begun!"));