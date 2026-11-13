const prisma = require("../prisma");

// Converte um valor (número ou string só com dígitos) em inteiro positivo; null se inválido
function parseId(value) {
  const isNumeric =
    typeof value === "number" || (typeof value === "string" && /^\d+$/.test(value));
  if (!isNumeric) return null;
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}

// Valida um id de usuário e confirma que ele existe.
// Retorna { userId } ou { status, error }.
async function resolveUser(raw) {
  const userId = parseId(raw);
  if (userId === null) return { status: 400, error: "userId inválido." };

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
  if (!user) return { status: 404, error: "Usuário não encontrado." };

  return { userId };
}

// Lê o ?userId= opcional da query (null se não informado)
async function readOptionalUserId(query) {
  if (query.userId === undefined) return { userId: null };
  return resolveUser(query.userId);
}

module.exports = { parseId, resolveUser, readOptionalUserId };
