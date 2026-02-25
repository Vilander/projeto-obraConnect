/**
 * Configuração de Conexão com MySQL
 * Usa mysql2/promise para operações assíncronas
 */

require("dotenv").config();
const mysql = require("mysql2/promise");

// Criar pool de conexões (melhor performance que conexão única)
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "obraconnect_db",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Testar conexão ao iniciar
pool
  .getConnection()
  .then((connection) => {
    console.log("✅ Conectado ao banco de dados MySQL com sucesso!");
    connection.release();
  })
  .catch((erro) => {
    console.error("❌ Erro ao conectar no banco de dados:", erro.message);
    process.exit(1);
  });

module.exports = pool;
