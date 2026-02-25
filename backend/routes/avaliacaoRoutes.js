/**
 * Rotas de Avaliações
 * - GET /servico/:id - Listar avaliações de um serviço
 * - GET /meu-historico - Minhas avaliações (protegido)
 * - POST / - Deixar avaliação (protegido)
 * - DELETE /:id - Deletar avaliação (protegido)
 */

const express = require("express");
const banco = require("../config/database");
const { verificarToken } = require("../middlewares/autenticacao");

const router = express.Router();

// ===============================================
// 1. LISTAR AVALIAÇÕES DE UM SERVIÇO (PÚBLICO)
// ===============================================
router.get("/servico/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [avaliacoes] = await banco.query(
      `
      SELECT a.*, u.nome_usuario
      FROM oc__tb_avaliacao a
      JOIN oc__tb_usuario u ON a.id_usuario = u.id
      WHERE a.id_servico = ?
      ORDER BY a.data_avaliacao DESC
    `,
      [id],
    );

    // Calcular média das notas
    if (avaliacoes.length > 0) {
      const somaPreco = avaliacoes.reduce((sum, a) => sum + a.nota_preco, 0);
      const somaTempo = avaliacoes.reduce(
        (sum, a) => sum + a.nota_tempo_execucao,
        0,
      );
      const somaHigiene = avaliacoes.reduce(
        (sum, a) => sum + a.nota_higiene,
        0,
      );
      const somaEducacao = avaliacoes.reduce(
        (sum, a) => sum + a.nota_educacao,
        0,
      );
      const total = avaliacoes.length;

      const medias = {
        preco: (somaPreco / total).toFixed(1),
        tempo: (somaTempo / total).toFixed(1),
        higiene: (somaHigiene / total).toFixed(1),
        educacao: (somaEducacao / total).toFixed(1),
        geral: (
          (somaPreco + somaTempo + somaHigiene + somaEducacao) /
          (total * 4)
        ).toFixed(1),
      };

      return res.status(200).json({
        total_avaliacoes: total,
        medias: medias,
        avaliacoes: avaliacoes,
      });
    }

    res.status(200).json({
      total_avaliacoes: 0,
      medias: null,
      avaliacoes: [],
    });
  } catch (erro) {
    console.error("Erro ao listar avaliações:", erro);
    res.status(500).json({ erro: "Erro ao listar avaliações." });
  }
});

// ===============================================
// 2. MINHAS AVALIAÇÕES (PROTEGIDO)
// ===============================================
router.get("/meu-historico", verificarToken, async (req, res) => {
  try {
    const [avaliacoes] = await banco.query(
      `
      SELECT a.*, s.titulo as nome_servico, u.nome_usuario
      FROM oc__tb_avaliacao a
      JOIN oc__tb_servico s ON a.id_servico = s.id
      JOIN oc__tb_usuario u ON s.id_usuario = u.id
      WHERE a.id_usuario = ?
      ORDER BY a.data_avaliacao DESC
    `,
      [req.usuario.id],
    );

    res.status(200).json(avaliacoes);
  } catch (erro) {
    console.error("Erro ao buscar minhas avaliações:", erro);
    res.status(500).json({ erro: "Erro ao buscar suas avaliações." });
  }
});

// ===============================================
// 3. DEIXAR AVALIAÇÃO (PROTEGIDO)
// ===============================================
router.post("/", verificarToken, async (req, res) => {
  const {
    id_servico,
    nota_preco,
    nota_tempo_execucao,
    nota_higiene,
    nota_educacao,
    comentario,
  } = req.body;

  // Validar campos
  if (
    !id_servico ||
    !nota_preco ||
    !nota_tempo_execucao ||
    !nota_higiene ||
    !nota_educacao
  ) {
    return res.status(400).json({ erro: "Todas as notas são obrigatórias!" });
  }

  // Validar se as notas estão entre 1 e 5
  const notas = [nota_preco, nota_tempo_execucao, nota_higiene, nota_educacao];
  if (notas.some((nota) => nota < 1 || nota > 5)) {
    return res.status(400).json({ erro: "As notas devem estar entre 1 e 5!" });
  }

  try {
    // Verificar se serviço existe
    const [servicos] = await banco.query(
      "SELECT * FROM oc__tb_servico WHERE id = ?",
      [id_servico],
    );

    if (servicos.length === 0) {
      return res.status(404).json({ erro: "Serviço não encontrado." });
    }

    // Verificar se já avaliou este serviço
    const [avaliacaoExistente] = await banco.query(
      "SELECT * FROM oc__tb_avaliacao WHERE id_servico = ? AND id_usuario = ?",
      [id_servico, req.usuario.id],
    );

    if (avaliacaoExistente.length > 0) {
      return res.status(400).json({ erro: "Você já avaliou este serviço!" });
    }

    // Inserir avaliação
    const [resultado] = await banco.query(
      `INSERT INTO oc__tb_avaliacao (id_servico, id_usuario, nota_preco, nota_tempo_execucao, nota_higiene, nota_educacao, comentario, data_avaliacao)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        id_servico,
        req.usuario.id,
        nota_preco,
        nota_tempo_execucao,
        nota_higiene,
        nota_educacao,
        comentario || null,
      ],
    );

    res.status(201).json({
      mensagem: "Avaliação registrada com sucesso!",
      id_avaliacao: resultado.insertId,
    });
  } catch (erro) {
    console.error("Erro ao registrar avaliação:", erro);
    res.status(500).json({ erro: "Erro ao registrar avaliação." });
  }
});

// ===============================================
// 4. DELETAR AVALIAÇÃO (PROTEGIDO)
// ===============================================
router.delete("/:id", verificarToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar se existe e se é dono
    const [avaliacoes] = await banco.query(
      "SELECT * FROM oc__tb_avaliacao WHERE id = ?",
      [id],
    );

    if (avaliacoes.length === 0) {
      return res.status(404).json({ erro: "Avaliação não encontrada." });
    }

    if (avaliacoes[0].id_usuario !== req.usuario.id) {
      return res
        .status(403)
        .json({ erro: "Você não tem permissão para deletar esta avaliação." });
    }

    // Deletar avaliação
    await banco.query("DELETE FROM oc__tb_avaliacao WHERE id = ?", [id]);

    res.status(200).json({
      mensagem: "Avaliação deletada com sucesso!",
    });
  } catch (erro) {
    console.error("Erro ao deletar avaliação:", erro);
    res.status(500).json({ erro: "Erro ao deletar avaliação." });
  }
});

module.exports = router;
