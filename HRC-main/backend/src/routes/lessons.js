const { Router } = require("express");
const { getLesson } = require("../controllers/lessonController");
const { createAttempt } = require("../controllers/attemptController");

const router = Router();

router.get("/:id", getLesson);
router.post("/:id/attempts", createAttempt);

module.exports = router;
