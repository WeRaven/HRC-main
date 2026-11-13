const { Router } = require("express");
const { listTracks, listTrackLessons } = require("../controllers/trackController");

const router = Router();

router.get("/", listTracks);
router.get("/:slug/lessons", listTrackLessons);

module.exports = router;
