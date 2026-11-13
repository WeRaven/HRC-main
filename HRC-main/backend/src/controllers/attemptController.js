const prisma = require("../prisma");
const { parseId, resolveUser } = require("../utils/params");
const { PASSING_SCORE, getTrackAccess } = require("../utils/trackAccess");

// POST /api/lessons/:id/attempts
// Body: { userId, answers: [{ questionId, selectedOption }], timeSpent? (segundos) }
async function createAttempt(req, res) {
  try {
    const lessonId = parseId(req.params.id);
    if (lessonId === null) {
      return res.status(400).json({ error: "Id da aula inválido." });
    }

    const body = req.body ?? {};

    if (body.userId === undefined) {
      return res.status(400).json({ error: "userId é obrigatório." });
    }
    const user = await resolveUser(body.userId);
    if (user.error) return res.status(user.status).json({ error: user.error });
    const { userId } = user;

    const timeSpent = body.timeSpent === undefined ? 0 : body.timeSpent;
    if (!Number.isInteger(timeSpent) || timeSpent < 0) {
      return res
        .status(400)
        .json({ error: "timeSpent deve ser um inteiro (segundos) maior ou igual a 0." });
    }

    if (!Array.isArray(body.answers)) {
      return res
        .status(400)
        .json({ error: "answers deve ser uma lista de { questionId, selectedOption }." });
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { quiz: { include: { questions: { orderBy: { id: "asc" } } } } },
    });
    if (!lesson) {
      return res.status(404).json({ error: "Aula não encontrada." });
    }
    if (!lesson.quiz || lesson.quiz.questions.length === 0) {
      return res.status(404).json({ error: "Esta aula não possui quiz." });
    }

    const accessBefore = await getTrackAccess(userId);
    const entry = accessBefore.find((a) => a.track.id === lesson.trackId);
    if (entry?.locked) {
      return res.status(403).json({
        error: `Trilha bloqueada: é preciso média de ${PASSING_SCORE}% nas trilhas anteriores.`,
      });
    }

    // Valida as respostas: todas as perguntas, sem repetição, alternativa dentro do intervalo
    const questions = lesson.quiz.questions;
    const questionById = new Map(questions.map((q) => [q.id, q]));
    const selectedByQuestion = new Map();

    for (const answer of body.answers) {
      const question = questionById.get(answer?.questionId);
      if (!question) {
        return res
          .status(400)
          .json({ error: "questionId inválido ou fora do quiz desta aula." });
      }
      if (selectedByQuestion.has(question.id)) {
        return res.status(400).json({ error: "Há perguntas respondidas mais de uma vez." });
      }
      const option = answer.selectedOption;
      if (!Number.isInteger(option) || option < 0 || option >= question.options.length) {
        return res
          .status(400)
          .json({ error: `selectedOption inválido na pergunta ${question.id}.` });
      }
      selectedByQuestion.set(question.id, option);
    }

    if (selectedByQuestion.size !== questions.length) {
      return res.status(400).json({ error: "Responda todas as perguntas do quiz." });
    }

    // Correção (feita só no servidor)
    const graded = questions.map((q) => {
      const selectedOption = selectedByQuestion.get(q.id);
      return { question: q, selectedOption, isCorrect: selectedOption === q.correctOption };
    });
    const correctCount = graded.filter((g) => g.isCorrect).length;
    const score = Math.round((correctCount / questions.length) * 100);

    // Tentativa + respostas + progresso na mesma transação
    const { attempt, progress } = await prisma.$transaction(async (tx) => {
      const attempt = await tx.quizAttempt.create({
        data: {
          userId,
          lessonId,
          score,
          timeSpent,
          answers: {
            create: graded.map((g) => ({
              questionId: g.question.id,
              selectedOption: g.selectedOption,
              isCorrect: g.isCorrect,
            })),
          },
        },
      });

      const key = { userId_lessonId: { userId, lessonId } };
      const existing = await tx.progress.findUnique({ where: key });
      const bestScore = Math.max(existing?.bestScore ?? 0, score);
      const completed = (existing?.completed ?? false) || score >= PASSING_SCORE;

      const progress = await tx.progress.upsert({
        where: key,
        update: { bestScore, completed },
        create: { userId, lessonId, bestScore, completed },
      });

      return { attempt, progress };
    });

    // Trilhas que esta tentativa acabou de liberar
    const accessAfter = await getTrackAccess(userId);
    const unlockedTracks = accessAfter
      .filter(
        (a) =>
          !a.locked && accessBefore.find((b) => b.track.id === a.track.id)?.locked
      )
      .map((a) => a.track.slug);

    return res.status(201).json({
      attemptId: attempt.id,
      score,
      correctCount,
      totalQuestions: questions.length,
      passed: score >= PASSING_SCORE,
      bestScore: progress.bestScore,
      completed: progress.completed,
      unlockedTracks,
      results: graded.map((g) => ({
        questionId: g.question.id,
        selectedOption: g.selectedOption,
        correctOption: g.question.correctOption,
        isCorrect: g.isCorrect,
        explanation: g.question.explanation,
      })),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
}

module.exports = { createAttempt };
