// import libraries
import express from "express";
import mongoose from "mongoose";

// import routers
import { abilities } from "./routes/abilities.ts";

// setup
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());

// connect to database
mongoose.connect("mongodb://localhost/codemon");
/* 
  normally you put the database path in .env for safety!
  but for ease of use, and since it's running locally, I've put it here

  for reference:

  in .env
    DATABASE_URL=mongodb://localhost/test

  in server.ts
    import { configDotenv } from "dotenv";
    montgoose.connect(process.env.DATABASE_URL);
*/

// test database connection
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Database of madness has started!"));

// render index.ejs
app.get("/", (_, res) => {
  console.log("Fire is starting to spread on your screen!");
  res.render("index");
})

// setup routers
app.use("/abilities", abilities);

// start server
app.listen(3000, () => console.log("Chaos has spread!"));