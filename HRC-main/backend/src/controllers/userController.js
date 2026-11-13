const prisma = require("../prisma");
const { parseId } = require("../utils/params");
const { getTrackAccess } = require("../utils/trackAccess");

async function createUser(req, res) {
  try {
    const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";

    if (!name) {
      return res.status(400).json({ error: "O nome é obrigatório." });
    }

    const user = await prisma.user.create({ data: { name } });
    return res.status(201).json(user);
  } catch (error) {
    // P2002 = violação de unicidade no banco (nome já existe)
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Já existe um usuário com esse nome." });
    }
    console.error(error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
}

// GET /api/users/:id/progress
// Resumo do usuário: progresso geral e, por trilha, média, bloqueio e situação de cada aula.
async function getUserProgress(req, res) {
  try {
    const userId = parseId(req.params.id);
    if (userId === null) {
      return res.status(400).json({ error: "Id do usuário inválido." });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, createdAt: true },
    });
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const [access, lessons, progress] = await Promise.all([
      getTrackAccess(userId),
      prisma.lesson.findMany({
        orderBy: [{ trackId: "asc" }, { order: "asc" }],
        select: { id: true, trackId: true, title: true, order: true },
      }),
      prisma.progress.findMany({
        where: { userId },
        select: { lessonId: true, completed: true, bestScore: true },
      }),
    ]);

    const progressByLesson = new Map(progress.map((p) => [p.lessonId, p]));

    const tracks = access.map(({ track, lessonCount, averageScore, locked }) => {
      const trackLessons = lessons
        .filter((l) => l.trackId === track.id)
        .map((l) => {
          const p = progressByLesson.get(l.id);
          return {
            id: l.id,
            title: l.title,
            order: l.order,
            completed: p?.completed ?? false,
            bestScore: p?.bestScore ?? 0,
          };
        });

      return {
        id: track.id,
        slug: track.slug,
        title: track.title,
        locked,
        lessonCount,
        averageScore,
        completedLessons: trackLessons.filter((l) => l.completed).length,
        lessons: trackLessons,
      };
    });

    return res.json({
      user,
      overall: {
        completedLessons: tracks.reduce((sum, t) => sum + t.completedLessons, 0),
        totalLessons: lessons.length,
      },
      tracks,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
}

module.exports = { createUser, getUserProgress };
