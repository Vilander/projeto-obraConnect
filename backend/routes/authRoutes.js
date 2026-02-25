/**
 * Rotas de Autenticação
 * - POST /registro - Registrar novo usuário
 * - POST /login - Fazer login
 * - GET /perfil - Ver dados do usuário logado
 * - PUT /tornar-prestador - Virar prestador
 */

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const banco = require("../config/database");
const { verificarToken } = require("../middlewares/autenticacao");

const router = express.Router();

// ✅ FUNÇÃO HELPER - Gerar Token JWT
function gerarToken(usuario) {
  return jwt.sign(
    {
      id: usuario.id,
      nome: usuario.nome_usuario,
      email: usuario.email,
      tipo_usuario: usuario.tipo_usuario,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY },
  );
}

// ===============================================
// 1. REGISTRO DE NOVO USUÁRIO
// ===============================================
router.post("/registro", async (req, res) => {
  const { nome_usuario, email, senha, login } = req.body;

  // Validar campos obrigatórios
  if (!nome_usuario || !email || !senha || !login) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios!" });
  }

  // Validar email
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(email)) {
    return res.status(400).json({ erro: "Email inválido!" });
  }

  // Validar comprimento de senha
  if (senha.length < 6) {
    return res
      .status(400)
      .json({ erro: "Senha deve ter pelo menos 6 caracteres!" });
  }

  try {
    // Verificar se usuário/email já existe
    const [usuariosExistentes] = await banco.query(
      "SELECT * FROM oc__tb_usuario WHERE email = ? OR login = ?",
      [email, login],
    );

    if (usuariosExistentes.length > 0) {
      return res.status(409).json({ erro: "E-mail ou Login já cadastrados!" });
    }

    // Criptografar senha com bcrypt
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, salt);

    // Inserir usuário no banco
    const [resultado] = await banco.query(
      "INSERT INTO oc__tb_usuario (nome_usuario, email, senha, login, tipo_usuario, data_cadastro) VALUES (?, ?, ?, ?, ?, NOW())",
      [nome_usuario, email, senhaCriptografada, login, "usuario"],
    );

    res.status(201).json({
      mensagem: "Usuário registrado com sucesso!",
      id_usuario: resultado.insertId,
      usuario: nome_usuario,
    });
  } catch (erro) {
    console.error("Erro ao registrar usuário:", erro);
    res.status(500).json({ erro: "Erro ao registrar usuário." });
  }
});

// ===============================================
// 2. LOGIN
// ===============================================
router.post("/login", async (req, res) => {
  const { login, senha } = req.body;

  // Validar campos
  if (!login || !senha) {
    return res.status(400).json({ erro: "Login e senha são obrigatórios!" });
  }

  try {
    // Buscar usuário por login ou email
    const [usuarios] = await banco.query(
      "SELECT * FROM oc__tb_usuario WHERE login = ? OR email = ?",
      [login, login],
    );

    if (usuarios.length === 0) {
      return res.status(401).json({ erro: "Usuário ou senha incorretos." });
    }

    const usuario = usuarios[0];

    // Verificar senha com bcrypt
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: "Usuário ou senha incorretos." });
    }

    // Gerar token
    const token = gerarToken(usuario);

    // Retornar sucesso
    res.status(200).json({
      mensagem: "Login realizado com sucesso!",
      token: token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome_usuario,
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario,
      },
    });
  } catch (erro) {
    console.error("Erro ao fazer login:", erro);
    res.status(500).json({ erro: "Erro ao fazer login." });
  }
});

// ===============================================
// 3. VER PERFIL (PROTEGIDO)
// ===============================================
router.get("/perfil", verificarToken, async (req, res) => {
  try {
    // Buscar dados atualizados do usuário
    const [usuarios] = await banco.query(
      "SELECT id, nome_usuario, email, login, tipo_usuario, data_cadastro FROM oc__tb_usuario WHERE id = ?",
      [req.usuario.id],
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    res.status(200).json({
      mensagem: "Dados do usuário",
      usuario: usuarios[0],
    });
  } catch (erro) {
    console.error("Erro ao buscar perfil:", erro);
    res.status(500).json({ erro: "Erro ao buscar dados do usuário." });
  }
});

// ===============================================
// 4. TORNAR PRESTADOR (PROTEGIDO)
// ===============================================
router.put("/tornar-prestador", verificarToken, async (req, res) => {
  try {
    // Verificar se já é prestador
    const [usuarios] = await banco.query(
      "SELECT tipo_usuario FROM oc__tb_usuario WHERE id = ?",
      [req.usuario.id],
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    if (
      usuarios[0].tipo_usuario === "prestador" ||
      usuarios[0].tipo_usuario === "admin"
    ) {
      return res.status(400).json({ erro: "Você já é prestador!" });
    }

    // Atualizar tipo de usuário
    await banco.query(
      "UPDATE oc__tb_usuario SET tipo_usuario = ? WHERE id = ?",
      ["prestador", req.usuario.id],
    );

    // Gerar novo token com tipo atualizado
    const usuarioAtualizado = {
      ...req.usuario,
      tipo_usuario: "prestador",
    };
    const novoToken = gerarToken(usuarioAtualizado);

    res.status(200).json({
      mensagem: "Você agora é um prestador!",
      token: novoToken,
      usuario: usuarioAtualizado,
    });
  } catch (erro) {
    console.error("Erro ao atualizar para prestador:", erro);
    res.status(500).json({ erro: "Erro ao atualizar usuário." });
  }
});

module.exports = router;
