require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const banco = require("./config/database");

// Importar rotas
const authRoutes = require("./routes/authRoutes");
const servicoRoutes = require("./routes/servicoRoutes");
const avaliacaoRoutes = require("./routes/avaliacaoRoutes");
const testesRoutes = require("./routes/testesRoutes");

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
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
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

// Registrar rotas
app.use("/api/auth", authRoutes);
app.use("/api/servicos", servicoRoutes);
app.use("/api/avaliacoes", avaliacaoRoutes);
app.use("/api/testes", testesRoutes);

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
  console.log(`|Servidor rodando|`);
  console.log("");
});

process.on("SIGTERM", () => {
  console.log("Servidor encerrando...");
  process.exit(0);
});
