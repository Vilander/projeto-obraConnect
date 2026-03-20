const express = require("express");
const router = express.Router();
const banco = require("../config/database");;

router.get("/", (req, res) => {
  res.status(200).json({
    mensagem: "Bem-vindo ao ObraConnect Refatorado!",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      servicos: "/api/servicos",
      avaliacoes: "/api/avaliacoes",
    },
  });
});

// Rota de teste do banco
router.get("/teste-banco", async (req, res) => {
  try {
    const [resultado] = await banco.query("SELECT 1 as teste");
    res.status(200).json({
      mensagem: "✅ Banco de dados conectado com sucesso!",
      teste: resultado,
    });
  } catch (erro) {
    console.error("Erro ao testar banco:", erro);
    res.status(500).json({
      erro: "❌ Erro ao conectar no banco de dados",
      detalhes: erro.message,
    });
  }
});

module.exports = router;