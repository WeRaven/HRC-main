const { Router } = require("express");
const { createUser, getUserProgress } = require("../controllers/userController");

const router = Router();

router.post("/", createUser);
router.get("/:id/progress", getUserProgress);

module.exports = router;
