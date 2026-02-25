/**
 * API Helper - ObraConnect
 * Funções reutilizáveis para fazer requisições à API
 */

// URL base da API
const API_BASE_URL = "http://localhost:3001/api";

/**
 * Função genérica para fazer requisições
 */
async function fazerRequisicao(endpoint, metodo = "GET", dados = null) {
  try {
    const opcoes = {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Adicionar token se existir
    const token = localStorage.getItem("token");
    if (token) {
      opcoes.headers["Authorization"] = `Bearer ${token}`;
    }

    // Adicionar corpo se existir
    if (dados) {
      opcoes.body = JSON.stringify(dados);
    }

    const resposta = await fetch(`${API_BASE_URL}${endpoint}`, opcoes);
    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(resultado.erro || "Erro na requisição");
    }

    return {
      sucesso: true,
      dados: resultado,
    };
  } catch (erro) {
    return {
      sucesso: false,
      erro: erro.message,
    };
  }
}

/**
 * Função para fazer upload de imagem
 */
async function fazerUpload(endpoint, arquivo) {
  try {
    const formData = new FormData();
    formData.append("imagem", arquivo);

    const opcoes = {
      method: "POST",
    };

    // Adicionar token se existir
    const token = localStorage.getItem("token");
    if (token) {
      opcoes.headers = {
        Authorization: `Bearer ${token}`,
      };
    }

    opcoes.body = formData;

    const resposta = await fetch(`${API_BASE_URL}${endpoint}`, opcoes);
    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(resultado.erro || "Erro ao fazer upload");
    }

    return {
      sucesso: true,
      dados: resultado,
    };
  } catch (erro) {
    return {
      sucesso: false,
      erro: erro.message,
    };
  }
}

// ============================================
// FUNÇÕES DE AUTENTICAÇÃO
// ============================================

async function registrarUsuario(nome, email, senha, login, telefone) {
  return fazerRequisicao("/auth/registro", "POST", {
    nome_usuario: nome,
    email,
    senha,
    login,
    telefone,
  });
}

async function fazerLogin(loginOuEmail, senha) {
  return fazerRequisicao("/auth/login", "POST", {
    login: loginOuEmail,
    senha,
  });
}

async function obterPerfil() {
  return fazerRequisicao("/auth/perfil");
}

async function tornarPrestador() {
  return fazerRequisicao("/auth/tornar-prestador", "PUT");
}

// ============================================
// FUNÇÕES DE SERVIÇOS
// ============================================

async function listarServicos() {
  return fazerRequisicao("/servicos");
}

async function buscarServicoPorId(id) {
  return fazerRequisicao(`/servicos/${id}`);
}

async function listarMeusServicos() {
  return fazerRequisicao("/servicos/meus/servicos");
}

async function criarServico(titulo, descricao, idCategoria, arquivo) {
  const formData = new FormData();
  formData.append("titulo", titulo);
  formData.append("descricao", descricao);
  formData.append("id_categoria", idCategoria);
  if (arquivo) {
    formData.append("imagem", arquivo);
  }

  try {
    const opcoes = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    };

    const resposta = await fetch(`${API_BASE_URL}/servicos`, opcoes);
    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(resultado.erro || "Erro ao criar serviço");
    }

    return {
      sucesso: true,
      dados: resultado,
    };
  } catch (erro) {
    return {
      sucesso: false,
      erro: erro.message,
    };
  }
}

async function editarServico(
  id,
  titulo,
  descricao,
  idCategoria,
  arquivo = null,
) {
  const formData = new FormData();
  formData.append("titulo", titulo);
  formData.append("descricao", descricao);
  formData.append("id_categoria", idCategoria);
  if (arquivo) {
    formData.append("imagem", arquivo);
  }

  try {
    const opcoes = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    };

    const resposta = await fetch(`${API_BASE_URL}/servicos/${id}`, opcoes);
    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(resultado.erro || "Erro ao editar serviço");
    }

    return {
      sucesso: true,
      dados: resultado,
    };
  } catch (erro) {
    return {
      sucesso: false,
      erro: erro.message,
    };
  }
}

async function deletarServico(id) {
  return fazerRequisicao(`/servicos/${id}`, "DELETE");
}

async function desativarServico(id) {
  return fazerRequisicao(`/servicos/${id}/desativar`, "PATCH");
}

// ============================================
// FUNÇÕES DE AVALIAÇÕES
// ============================================

async function listarAvaliacoes(idServico) {
  return fazerRequisicao(`/avaliacoes/servico/${idServico}`);
}

async function obterMinhasAvaliacoes() {
  return fazerRequisicao("/avaliacoes/meu-historico");
}

async function criarAvaliacao(idServico, notas, comentario) {
  return fazerRequisicao("/avaliacoes", "POST", {
    id_servico: idServico,
    nota_preco: notas.preco,
    nota_tempo_execucao: notas.tempo,
    nota_higiene: notas.higiene,
    nota_educacao: notas.educacao,
    comentario,
  });
}

async function deletarAvaliacao(id) {
  return fazerRequisicao(`/avaliacoes/${id}`, "DELETE");
}

// ============================================
// UTILITÁRIOS
// ============================================

/**
 * Verifica se o usuário está autenticado
 */
function estaAutenticado() {
  const token = localStorage.getItem("token");
  return !!token;
}

/**
 * Obtém dados do usuário armazenado
 */
function obterUsuarioArmazenado() {
  const usuario = localStorage.getItem("usuario");
  return usuario ? JSON.parse(usuario) : null;
}

/**
 * Fazer logout
 */
function fazerLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
}

/**
 * Renderizar estrelas de avaliação
 */
function renderizarEstrelas(nota) {
  let estrelas = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.round(nota)) {
      estrelas += '<i class="bi bi-star-fill"></i>';
    } else {
      estrelas += '<i class="bi bi-star"></i>';
    }
  }
  return estrelas;
}
