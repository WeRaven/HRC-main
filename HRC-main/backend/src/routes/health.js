const { Router } = require("express");
const prisma = require("../prisma");

const router = Router();

// Testa só a API
router.get("/", (req, res) => {
  res.json({ status: "ok" });
});

// Testa API + conexão com o banco
router.get("/db", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    console.error(error);
    res.status(503).json({ status: "error", database: "unreachable" });
  }
});

module.exports = router;