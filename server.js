// importing libraries using the import syntax favoured by ES6
import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
// import data from "../data/setupDatabase.js";
// import dotenv from "dotenv";

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// setup server
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use("/managers", express.static(path.join(__dirname, "managers")));
app.use(express.json());

// route logging middleware
app.use((req, _, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

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
import abilitiesRouter from "./routes/routerAbilities.js";
app.use("/abilities", abilitiesRouter);

import codemonRouter from "./routes/routerCodemon.js";
app.use("/codemon", codemonRouter);

import trainersRouter from "./routes/routerTrainers.js";
app.use("/trainers", trainersRouter);

import dialogueRouter from "./routes/routerDialogue.js";
app.use("/dialogue", dialogueRouter);

// render index.ejs
app.get("/", (req, res) => {
	console.log("Fire is starting to spread on your screen!");
	console.log("Request URL:", req.url);
	console.log("Request method:", req.method);
	res.render("index");
});

// 404 handler for unmatched routes
app.use((req, res) => {
	console.log("404 - Route not found:", req.method, req.url);
	res.status(404).send("Route not found: " + req.url);
});

// start server
app.listen(3001, () => console.log("Chaos has begun!"));