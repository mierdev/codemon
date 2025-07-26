import Ability from "../models/modelAbilities.ts";
import { Router } from "express";
const abilitiesRouter = Router();

// get all abilities
abilitiesRouter.get("/", async (_, res) => {
  try {
    const abilities = await Ability.find();
    res.json(abilities);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// get one ability
abilitiesRouter.get("/:id", (req, res) => {
  res.send(`get one ability, id = ${req.params.id}`);
})

// create one ability
abilitiesRouter.post("/", async (req, res) => {
  const ability = new Ability({
      name: req.body.name,
      type: req.body.type,
      description: req.body.description,
      power: req.body.power,
      accuracy: req.body.accuracy,
      statusEffectAttack: req.body.statusEffectAttack,
      statusEffectSpecialAttack: req.body.statusEffectSpecialAttack,
      statusEffectDefense: req.body.statusEffectDefense,
      statusEffectSpecialDefense: req.body.statusEffectSpecialDefense,
      statusEffectSpeed: req.body.statusEffectSpeed
    });
  
  try {
    const newAbility = await ability.save();
    res.status(201).json(newAbility);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  };
})



/* will active later when implemented

// update one ability
abilitiesRouter.patch("/:id", (req, res) => {
  res.send("update one ability");
})

// delete one ability
abilitiesRouter.delete("/:id", (req, res) => {
  res.send("delete one ability");

*/


export { abilitiesRouter };