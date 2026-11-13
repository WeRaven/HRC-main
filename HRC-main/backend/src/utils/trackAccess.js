const prisma = require("../prisma");

// Média mínima (0-100) nas trilhas livres para liberar as trilhas com isLocked = true
const PASSING_SCORE = 70;

// Calcula, para cada trilha, a média das melhores notas do usuário e se ela está bloqueada.
// A nota de uma aula sem progresso conta como 0. Sem userId, nada foi desbloqueado.
async function getTrackAccess(userId) {
  const tracks = await prisma.track.findMany({
    orderBy: { order: "asc" },
    include: { lessons: { select: { id: true } } },
  });

  const bestByLesson = new Map();
  if (userId !== null) {
    const progress = await prisma.progress.findMany({
      where: { userId },
      select: { lessonId: true, bestScore: true },
    });
    for (const p of progress) bestByLesson.set(p.lessonId, p.bestScore);
  }

  const stats = tracks.map((track) => {
    const total = track.lessons.reduce((sum, l) => sum + (bestByLesson.get(l.id) ?? 0), 0);
    const averageScore = track.lessons.length ? Math.round(total / track.lessons.length) : 0;
    return { track, lessonCount: track.lessons.length, averageScore };
  });

  // Trilhas bloqueadas (a integradora) abrem quando TODAS as trilhas livres atingem a média
  const freeTracks = stats.filter((s) => !s.track.isLocked);
  const unlocked = freeTracks.length > 0 && freeTracks.every((s) => s.averageScore >= PASSING_SCORE);

  return stats.map((s) => ({ ...s, locked: s.track.isLocked && !unlocked }));
}

module.exports = { PASSING_SCORE, getTrackAccess };
