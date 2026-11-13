const prisma = require("../prisma");
const { readOptionalUserId } = require("../utils/params");
const { PASSING_SCORE, getTrackAccess } = require("../utils/trackAccess");

// GET /api/tracks?userId=1
async function listTracks(req, res) {
  try {
    const user = await readOptionalUserId(req.query);
    if (user.error) return res.status(user.status).json({ error: user.error });

    const access = await getTrackAccess(user.userId);

    return res.json(
      access.map(({ track, lessonCount, averageScore, locked }) => ({
        id: track.id,
        slug: track.slug,
        title: track.title,
        description: track.description,
        order: track.order,
        lessonCount,
        locked,
        averageScore: user.userId === null ? null : averageScore,
      }))
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
}

// GET /api/tracks/:slug/lessons?userId=1
async function listTrackLessons(req, res) {
  try {
    const user = await readOptionalUserId(req.query);
    if (user.error) return res.status(user.status).json({ error: user.error });

    const access = await getTrackAccess(user.userId);
    const entry = access.find((a) => a.track.slug === req.params.slug);
    if (!entry) {
      return res.status(404).json({ error: "Trilha não encontrada." });
    }
    if (entry.locked) {
      return res.status(403).json({
        error: `Trilha bloqueada: é preciso média de ${PASSING_SCORE}% nas trilhas anteriores.`,
      });
    }

    const lessons = await prisma.lesson.findMany({
      where: { trackId: entry.track.id },
      orderBy: { order: "asc" },
      select: { id: true, title: true, order: true, simulationType: true },
    });

    const progressByLesson = new Map();
    if (user.userId !== null) {
      const progress = await prisma.progress.findMany({
        where: { userId: user.userId, lessonId: { in: lessons.map((l) => l.id) } },
        select: { lessonId: true, completed: true, bestScore: true },
      });
      for (const p of progress) progressByLesson.set(p.lessonId, p);
    }

    return res.json({
      track: {
        id: entry.track.id,
        slug: entry.track.slug,
        title: entry.track.title,
        description: entry.track.description,
      },
      lessons: lessons.map((lesson) => {
        const p = progressByLesson.get(lesson.id);
        return {
          ...lesson,
          progress:
            user.userId === null
              ? null
              : { completed: p?.completed ?? false, bestScore: p?.bestScore ?? 0 },
        };
      }),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
}

module.exports = { listTracks, listTrackLessons };
