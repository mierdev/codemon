import { Router } from "express";
const playerCodemon = Router();

// get all player codemon
playerCodemon.get("/", (_, res) => {
  res.send("get all codemon");
});


/* will active later when implemented

// get one player codemon
router.get("/:id", (req, res) => {
  res.send("get one codemon");
})

// create one player codemon
router.post("/", (req, res) => {
  res.send("create a codemon");
})

// update one player codemon
router.patch("/:id", (req, res) => {
  res.send("update one codemon");
})

// delete one player codemon > not necessary? 
router.delete("/:id", (req, res) => {
  res.send("delete one codemon");

*/

export { playerCodemon };