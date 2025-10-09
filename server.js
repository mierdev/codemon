import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

export const app = express();

const ROOT = process.cwd();

app.set("view engine", "ejs");
app.set("views", path.join(ROOT, "views"));
app.use(express.static(path.join(ROOT, "public")));
app.use("/managers", express.static(path.join(ROOT, "managers")));
app.use(express.json());
// app.set("views", path.join(__dirname, "views"));
// app.use("/managers", express.static(path.join(__dirname, "managers")));

/**
 * Logs all incoming requests for debugging purposes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
app.use((req, _, next) => {
	console.log(`${req.method} ${req.url}`);
	next();
});

// mongoose.connect(process.env.MONGODB_URI);
let mongoReady = false;
async function ensureMongo() {
	if (mongoReady && mongoose.connection.readyState === 1) return;
	if (!process.env.MONGODB_URI) {
		console.warn("Mongo keys are missing");
		return;
	}
	await mongoose.connect(process.env.MONGODB_URI);
	mongoReady = true;
	console.log("Mongo connected");
	console.log("Database of madness has started!");
}

app.use(async (_req, _res, next) => {
	try {
		await ensureMongo();
		next();
	} catch (error) {
		next(error);
	}
});

// const db = mongoose.connection;
// db.on("error", (error) => console.log(error));
// db.once("open", () => console.log("Database of madness has started!"));

import abilitiesRouter from "./routes/routerAbilities.js";
app.use("/abilities", abilitiesRouter);

import codemonRouter from "./routes/routerCodemon.js";
app.use("/codemon", codemonRouter);

import trainersRouter from "./routes/routerTrainers.js";
app.use("/trainers", trainersRouter);

import dialogueRouter from "./routes/routerDialogue.js";
app.use("/dialogue", dialogueRouter);

import languageAbilitiesRouter from "./routes/routerLanguageAbilities.js";
app.use("/api/language-abilities", languageAbilitiesRouter);

/**
 * Renders the main game page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
app.get("/", (req, res) => {
	console.log("Fire is starting to spread on your screen!");
	console.log("Request URL:", req.url);
	console.log("Request method:", req.method);
	res.render("index");
});

/**
 * Handles 404 errors for unmatched routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
app.use((req, res) => {
	console.log("404 - Route not found:", req.method, req.url);
	res.status(404).send("Route not found: " + req.url);
});

const PORT = process.env.PORT || 3001;

if (import.meta.url === `file://${process.argv[1]}`) {
	app.listen(PORT, () => console.log("Chaos has begun!"));
}
