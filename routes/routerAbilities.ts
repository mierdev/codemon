import Abilities from "../models/modelAbilities.ts";
import { Router } from "express";
const abilitiesRouter = Router();

// get all abilities
abilitiesRouter.get("/", async (_, res) => {
  try {
    const abilities = await Abilities.find();
    res.json(abilities);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// get one abilities
abilitiesRouter.get("/:id", (req, res) => {
  res.send(`get one ability, id = ${req.params.id}`);
})



/* will active later when implemented

// create one abilities
abilitiesRouter.post("/", (req, res) => {
  res.send("create one ability");
})

// update one abilities
abilitiesRouter.patch("/:id", (req, res) => {
  res.send("update one ability");
})

// delete one abilities
abilitiesRouter.delete("/:id", (req, res) => {
  res.send("delete one ability");

*/


export { abilitiesRouter };