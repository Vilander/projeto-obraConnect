/**
 * Rotas de Serviços
 * - GET / - Listar todos os serviços (público)
 * - GET /:id - Detalhes de um serviço
 * - GET /meus/servicos - Listar meus serviços (protegido)
 * - POST / - Criar serviço (protegido)
 * - PUT /:id - Editar serviço (protegido)
 * - DELETE /:id - Deletar serviço (protegido)
 */

const express = require("express");
const banco = require("../config/database");
const upload = require("../config/upload");
const {
  verificarToken,
  verificarPrestador,
} = require("../middlewares/autenticacao");

const router = express.Router();

// ===============================================
// 1. LISTAR TODOS OS SERVIÇOS (PÚBLICO)
// ===============================================
router.get("/", async (req, res) => {
  try {
    const [servicos] = await banco.query(`
      SELECT 
        s.*,
        u.nome_usuario,
        u.email,
        CAST(COALESCE(AVG((a.nota_preco + a.nota_tempo_execucao + a.nota_higiene + a.nota_educacao) / 4), 0) AS DECIMAL(10,2)) as nota_media,
        COUNT(a.id) as total_avaliacoes
      FROM oc__tb_servico s
      JOIN oc__tb_usuario u ON s.id_usuario = u.id
      LEFT JOIN oc__tb_avaliacao a ON s.id = a.id_servico
      GROUP BY s.id
      ORDER BY s.data_cadastro DESC
    `);

    // Converter nota_media para número
    const servicosFormatados = servicos.map((s) => ({
      ...s,
      nota_media: parseFloat(s.nota_media) || 0,
    }));

    res.status(200).json(servicosFormatados);
  } catch (erro) {
    console.error("Erro ao listar serviços:", erro);
    res.status(500).json({ erro: "Erro ao listar serviços." });
  }
});

// ===============================================
// 2. LISTAR MEUS SERVIÇOS (PROTEGIDO) - DEVE VIR ANTES DE /:id
// ===============================================
router.get("/meus/servicos", verificarToken, async (req, res) => {
  try {
    const [servicos] = await banco.query(
      "SELECT * FROM oc__tb_servico WHERE id_usuario = ? ORDER BY data_cadastro DESC",
      [req.usuario.id],
    );

    res.status(200).json(servicos);
  } catch (erro) {
    console.error("Erro ao listar meus serviços:", erro);
    res.status(500).json({ erro: "Erro ao listar seus serviços." });
  }
});

// ===============================================
// 3. BUSCAR SERVIÇO POR ID (PÚBLICO)
// ===============================================
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [servicos] = await banco.query(
      `
      SELECT 
        s.*,
        u.nome_usuario,
        u.email,
        u.telefone,
        CAST(COALESCE(AVG((a.nota_preco + a.nota_tempo_execucao + a.nota_higiene + a.nota_educacao) / 4), 0) AS DECIMAL(10,2)) as nota_media,
        COUNT(a.id) as total_avaliacoes
      FROM oc__tb_servico s
      JOIN oc__tb_usuario u ON s.id_usuario = u.id
      LEFT JOIN oc__tb_avaliacao a ON s.id = a.id_servico
      WHERE s.id = ?
      GROUP BY s.id
    `,
      [id],
    );

    if (servicos.length === 0) {
      return res.status(404).json({ erro: "Serviço não encontrado." });
    }

    const servico = servicos[0];
    servico.nota_media = parseFloat(servico.nota_media) || 0;

    res.status(200).json(servico);
  } catch (erro) {
    console.error("Erro ao buscar serviço:", erro);
    res.status(500).json({ erro: "Erro ao buscar serviço." });
  }
});

// ===============================================
// 4. CRIAR NOVO SERVIÇO (PROTEGIDO - PRESTADOR)
// ===============================================
router.post(
  "/",
  verificarToken,
  verificarPrestador,
  upload.single("imagem"),
  async (req, res) => {
    const { titulo, descricao, id_categoria } = req.body;

    // Validar campos
    if (!titulo || !descricao) {
      return res
        .status(400)
        .json({ erro: "Título e Descrição são obrigatórios!" });
    }

    try {
      // Montar URL da imagem
      let imagemUrl = null;
      if (req.file) {
        imagemUrl = `http://localhost:${process.env.PORT}/uploads/${req.file.filename}`;
      }

      // Inserir no banco
      const [resultado] = await banco.query(
        `INSERT INTO oc__tb_servico (id_usuario, titulo, desc_servico, id_categoria, imagem_url, data_cadastro) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
        [req.usuario.id, titulo, descricao, id_categoria || null, imagemUrl],
      );

      res.status(201).json({
        mensagem: "Serviço criado com sucesso!",
        id_servico: resultado.insertId,
        imagem: imagemUrl,
      });
    } catch (erro) {
      console.error("Erro ao criar serviço:", erro);
      res.status(500).json({ erro: "Erro ao criar serviço." });
    }
  },
);

// ===============================================
// 5. EDITAR SERVIÇO (PROTEGIDO)
// ===============================================
router.put(
  "/:id",
  verificarToken,
  upload.single("imagem"),
  async (req, res) => {
    const { id } = req.params;
    const { titulo, descricao, id_categoria } = req.body;

    try {
      // Verificar se existe e se é dono
      const [servicos] = await banco.query(
        "SELECT * FROM oc__tb_servico WHERE id = ?",
        [id],
      );

      if (servicos.length === 0) {
        return res.status(404).json({ erro: "Serviço não encontrado." });
      }

      if (servicos[0].id_usuario !== req.usuario.id) {
        return res
          .status(403)
          .json({ erro: "Você não tem permissão para editar este serviço." });
      }

      // Montar query de atualização dinâmica
      let sql =
        "UPDATE oc__tb_servico SET titulo = ?, desc_servico = ?, id_categoria = ?";
      let params = [
        titulo || servicos[0].titulo,
        descricao || servicos[0].desc_servico,
        id_categoria || servicos[0].id_categoria,
      ];

      // Se houver nova imagem, atualizar também
      if (req.file) {
        sql += ", imagem_url = ?";
        params.push(
          `http://localhost:${process.env.PORT}/uploads/${req.file.filename}`,
        );
      }

      sql += " WHERE id = ?";
      params.push(id);

      await banco.query(sql, params);

      res.status(200).json({
        mensagem: "Serviço atualizado com sucesso!",
        id_servico: id,
      });
    } catch (erro) {
      console.error("Erro ao editar serviço:", erro);
      res.status(500).json({ erro: "Erro ao editar serviço." });
    }
  },
);

// ===============================================
// 6. DESATIVAR SERVIÇO (PROTEGIDO)
// ===============================================
router.patch("/:id/desativar", verificarToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar se existe e se é dono
    const [servicos] = await banco.query(
      "SELECT * FROM oc__tb_servico WHERE id = ?",
      [id],
    );

    if (servicos.length === 0) {
      return res.status(404).json({ erro: "Serviço não encontrado." });
    }

    if (servicos[0].id_usuario !== req.usuario.id) {
      return res
        .status(403)
        .json({ erro: "Você não tem permissão para desativar este serviço." });
    }

    // Desativar serviço (apenas mudar status para 0)
    await banco.query("UPDATE oc__tb_servico SET ativo = 0 WHERE id = ?", [id]);

    res.status(200).json({
      mensagem: "Serviço desativado com sucesso!",
      id_servico: id,
    });
  } catch (erro) {
    console.error("Erro ao desativar serviço:", erro);
    res.status(500).json({ erro: "Erro ao desativar serviço." });
  }
});

// ===============================================
// 7. DELETAR SERVIÇO (PROTEGIDO)
// ===============================================
router.delete("/:id", verificarToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar se existe e se é dono
    const [servicos] = await banco.query(
      "SELECT * FROM oc__tb_servico WHERE id = ?",
      [id],
    );

    if (servicos.length === 0) {
      return res.status(404).json({ erro: "Serviço não encontrado." });
    }

    if (servicos[0].id_usuario !== req.usuario.id) {
      return res
        .status(403)
        .json({ erro: "Você não tem permissão para deletar este serviço." });
    }

    // Deletar avaliações relacionadas primeiro (chave estrangeira)
    await banco.query("DELETE FROM oc__tb_avaliacao WHERE id_servico = ?", [
      id,
    ]);

    // Deletar serviço
    await banco.query("DELETE FROM oc__tb_servico WHERE id = ?", [id]);

    res.status(200).json({
      mensagem: "Serviço deletado com sucesso!",
    });
  } catch (erro) {
    console.error("Erro ao deletar serviço:", erro);
    res.status(500).json({ erro: "Erro ao deletar serviço." });
  }
});

module.exports = router;
