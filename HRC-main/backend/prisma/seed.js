const fs = require("fs");
const path = require("path");

const CONTENT_DIR = path.resolve(__dirname, "..", "content");
const TRACK_FILES = ["hardware", "redes", "combinada"];
const SIMULATION_TYPES = ["drag_drop", "click_diagram"];

function readLessonContent(where, contentFile) {
  if (typeof contentFile !== "string" || contentFile.trim() === "") {
    throw new Error(`${where}: falta o campo contentFile`);
  }
  const file = path.resolve(CONTENT_DIR, contentFile);
  if (!file.startsWith(CONTENT_DIR + path.sep)) {
    throw new Error(`${where}: contentFile deve apontar para dentro de backend/content`);
  }
  if (!fs.existsSync(file)) {
    throw new Error(`${where}: arquivo de texto não encontrado: ${contentFile}`);
  }
  const text = fs.readFileSync(file, "utf-8").trim();
  if (text === "") {
    throw new Error(`${where}: o arquivo ${contentFile} está vazio`);
  }
  return text;
}

function loadTrack(name) {
  const file = path.join(CONTENT_DIR, `${name}.json`);
  if (!fs.existsSync(file)) {
    throw new Error(`Arquivo de conteúdo não encontrado: ${file}`);
  }
  const data = JSON.parse(fs.readFileSync(file, "utf-8"));

  if (data.track?.slug !== name) {
    throw new Error(`${name}.json: o slug da trilha deve ser "${name}"`);
  }
  if (!Array.isArray(data.lessons) || data.lessons.length === 0) {
    throw new Error(`${name}.json: a trilha precisa ter aulas`);
  }

  const lessons = data.lessons.map((lesson) => {
    const where = `${name}.json, aula ${lesson.order}`;

    if (!SIMULATION_TYPES.includes(lesson.simulationType)) {
      throw new Error(`${where}: simulationType deve ser um de ${SIMULATION_TYPES.join(", ")}`);
    }

    const config = lesson.simulationConfig ?? {};
    if (typeof config !== "object" || Array.isArray(config)) {
      throw new Error(`${where}: simulationConfig deve ser um objeto`);
    }

    const questions = lesson.quiz?.questions;
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error(`${where}: o quiz precisa ter perguntas`);
    }
    for (const q of questions) {
      if (!Array.isArray(q.options) || q.options.length < 2) {
        throw new Error(`${where}: pergunta com menos de 2 alternativas`);
      }
      if (!Number.isInteger(q.correctOption) || q.correctOption < 0 || q.correctOption >= q.options.length) {
        throw new Error(`${where}: correctOption fora do intervalo em "${q.text}"`);
      }
    }

    return {
      ...lesson,
      content: readLessonContent(where, lesson.contentFile),
      simulationConfig: config,
    };
  });

  return { track: data.track, lessons };
}

async function main() {
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();

  try {
    // Valida todos os arquivos ANTES de apagar qualquer coisa
    const tracks = TRACK_FILES.map(loadTrack);

    await prisma.$transaction(async (tx) => {
      // O cascade apaga aulas, quizzes, perguntas, progresso, tentativas,
      // favoritos e certificados. Os usuários são mantidos.
      await tx.track.deleteMany();

      for (const { track, lessons } of tracks) {
        await tx.track.create({
          data: {
            ...track,
            lessons: {
              create: lessons.map((lesson) => ({
                order: lesson.order,
                title: lesson.title,
                content: lesson.content,
                simulationType: lesson.simulationType,
                simulationConfig: lesson.simulationConfig,
                quiz: {
                  create: {
                    questions: {
                      create: lesson.quiz.questions.map((q) => ({
                        text: q.text,
                        options: q.options,
                        correctOption: q.correctOption,
                        explanation: q.explanation,
                      })),
                    },
                  },
                },
              })),
            },
          },
        });
      }
    });

    console.log(`Seed concluído: ${tracks.length} trilhas carregadas.`);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error("Erro no seed:", error.message);
    process.exitCode = 1;
  });
}

module.exports = { loadTrack };
