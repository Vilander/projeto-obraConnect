/**
 * SERVIDOR PRINCIPAL - ObraConnect Refatorado
 * Marketplace de serviços de construção
 *
 * Tecnologias: Node.js + Express + MySQL
 * Frontend: HTML + Bootstrap + JavaScript Vanilla
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const banco = require("./config/database");

// Importar rotas
const authRoutes = require("./routes/authRoutes");
const servicoRoutes = require("./routes/servicoRoutes");
const avaliacaoRoutes = require("./routes/avaliacaoRoutes");

// Inicializar Express
const app = express();
const PORT = process.env.PORT || 3001;

// ===============================================
// MIDDLEWARES GLOBAIS
// ===============================================

// CORS - Permite requisições do frontend
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

// Body Parser - Entender JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (imagens)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===============================================
// ROTAS
// ===============================================

// Rota teste
app.get("/", (req, res) => {
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
app.get("/teste-banco", async (req, res) => {
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

// Registrar rotas
app.use("/api/auth", authRoutes);
app.use("/api/servicos", servicoRoutes);
app.use("/api/avaliacoes", avaliacaoRoutes);

// ===============================================
// TRATAMENTO DE ERROS
// ===============================================

// 404 - Rota não encontrada
app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada." });
});

// Erro geral
app.use((erro, req, res, next) => {
  console.error("Erro no servidor:", erro);
  res.status(500).json({
    erro: "Erro interno do servidor.",
    detalhes: process.env.NODE_ENV === "development" ? erro.message : undefined,
  });
});

// ===============================================
// INICIAR SERVIDOR
// ===============================================

app.listen(PORT, () => {
  console.log("");
  console.log("╔══════════════════════════════════════════════════╗");
  console.log("║    🏗️  OBRACONNECT🏗️                             ");
  console.log("╠══════════════════════════════════════════════════╣");
  console.log(`║  Servidor rodando em: http://localhost:${PORT}`);
  console.log("╚══════════════════════════════════════════════════╝");
  console.log("");
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("Servidor encerrando...");
  process.exit(0);
});
