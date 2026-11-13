const prisma = require("../prisma");
const { parseId, readOptionalUserId } = require("../utils/params");
const { PASSING_SCORE, getTrackAccess } = require("../utils/trackAccess");

// GET /api/lessons/:id?userId=1
// O gabarito (correctOption e explanation) NÃO é enviado: ele só volta após a tentativa.
async function getLesson(req, res) {
  try {
    const id = parseId(req.params.id);
    if (id === null) {
      return res.status(400).json({ error: "Id da aula inválido." });
    }

    const user = await readOptionalUserId(req.query);
    if (user.error) return res.status(user.status).json({ error: user.error });

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        quiz: {
          include: {
            questions: {
              orderBy: { id: "asc" },
              select: { id: true, text: true, options: true },
            },
          },
        },
      },
    });
    if (!lesson) {
      return res.status(404).json({ error: "Aula não encontrada." });
    }

    const access = await getTrackAccess(user.userId);
    const entry = access.find((a) => a.track.id === lesson.trackId);
    if (entry?.locked) {
      return res.status(403).json({
        error: `Trilha bloqueada: é preciso média de ${PASSING_SCORE}% nas trilhas anteriores.`,
      });
    }

    let progress = null;
    if (user.userId !== null) {
      const p = await prisma.progress.findUnique({
        where: { userId_lessonId: { userId: user.userId, lessonId: id } },
        select: { completed: true, bestScore: true },
      });
      progress = { completed: p?.completed ?? false, bestScore: p?.bestScore ?? 0 };
    }

    return res.json({
      id: lesson.id,
      title: lesson.title,
      order: lesson.order,
      trackSlug: entry?.track.slug ?? null,
      content: lesson.content,
      simulationType: lesson.simulationType,
      simulationConfig: lesson.simulationConfig,
      quiz: lesson.quiz ? { id: lesson.quiz.id, questions: lesson.quiz.questions } : null,
      progress,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
}

module.exports = { getLesson };
