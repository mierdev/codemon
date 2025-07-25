import { Router } from "express";
const abilities = Router();

// get all abilities
abilities.get("/", (_, res) => {
  res.send("get all abilities");
});

// get one abilities
abilities.get("/:id", (req, res) => {
  res.send(`get one ability, id = ${req.params.id}`);
})



/* will active later when implemented

// create one abilities
abilities.post("/", (req, res) => {
  res.send("create one ability");
})

// update one abilities
abilities.patch("/:id", (req, res) => {
  res.send("update one ability");
})

// delete one abilities
abilities.delete("/:id", (req, res) => {
  res.send("delete one ability");

*/


export { abilities };