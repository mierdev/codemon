/**
 * importing libraries using the import syntax favoured by ES6
 * require is preferred by common js which gives us the .cjs and can often cause headaches
 */
import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// setup server
const app = express();
app.set("view engine", "ejs");
// app.use(express.static("public"));
// Changed static to joined dirname
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
// Aded missing parenthesis
app.use(express.json());

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

// setup routes (adjusted to use ES6)
// const abilitiesRouter = require("./routes/routerAbilities.js");
import abilitiesRouter from "./routes/routerAbilities.js";
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

// start server changed to avoid conflics with vite
app.listen(3001, () => console.log("Chaos has begun!"));
