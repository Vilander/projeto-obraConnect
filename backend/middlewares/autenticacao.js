/**
 * Middleware de Autenticação com JWT
 * Verifica se o usuário está logado antes de acessar rotas protegidas
 */

const jwt = require("jsonwebtoken");

/**
 * Middleware para verificar JWT
 * Adiciona dados do usuário em req.usuario
 */
function verificarToken(req, res, next) {
  // 1. Pega o token do header Authorization
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer TOKEN"

  if (!token) {
    return res
      .status(401)
      .json({ erro: "Token não fornecido. Faça login primeiro." });
  }

  try {
    // 2. Verifica e decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Adiciona dados do usuário à requisição
    req.usuario = decoded;

    next();
  } catch (erro) {
    if (erro.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ erro: "Token expirado. Faça login novamente." });
    }

    return res.status(403).json({ erro: "Token inválido." });
  }
}

/**
 * Middleware para verificar se é prestador ou admin
 */
function verificarPrestador(req, res, next) {
  if (
    req.usuario.tipo_usuario !== "prestador" &&
    req.usuario.tipo_usuario !== "admin"
  ) {
    return res
      .status(403)
      .json({ erro: "Apenas prestadores podem acessar isso." });
  }
  next();
}

/**
 * Middleware para verificar se é admin
 */
function verificarAdmin(req, res, next) {
  if (req.usuario.tipo_usuario !== "admin") {
    return res
      .status(403)
      .json({ erro: "Apenas administradores podem acessar isso." });
  }
  next();
}

module.exports = {
  verificarToken,
  verificarPrestador,
  verificarAdmin,
};
