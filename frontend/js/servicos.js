/**
 * Gerenciar Serviços - ObraConnect
 * Funções para listar, criar, editar e deletar serviços
 */

/**
 * Listar todos os serviços
 */
async function carregarServicos() {
  try {
    const container = document.getElementById("servicos-container");
    if (!container) return;

    // Mostrar loading
    container.innerHTML =
      '<div class="loading"><div class="spinner-border" role="status"><span class="visually-hidden">Carregando...</span></div></div>';

    const resultado = await listarServicos();

    if (!resultado.sucesso) {
      container.innerHTML = `<div class="alert alert-danger">Erro ao carregar serviços: ${resultado.erro}</div>`;
      return;
    }

    const servicos = resultado.dados;

    if (servicos.length === 0) {
      container.innerHTML = `<div class="alert alert-info">Nenhum serviço cadastrado ainda.</div>`;
      return;
    }

    // Renderizar cards de serviços
    container.innerHTML = "";
    servicos.forEach((servico) => {
      const card = criarCardServico(servico);
      container.appendChild(card);
    });
  } catch (erro) {
    console.error("Erro ao carregar serviços:", erro);
  }
}

/**
 * Criar elemento de card do serviço
 */
function criarCardServico(servico) {
  const div = document.createElement("div");
  div.className = "col-12 col-sm-6 col-lg-4 fade-in";

  const estrelas = renderizarEstrelas(servico.nota_media || 0);
  const imagemUrl = servico.imagem_url || null;

  // Criar fallback para imagem
  let imagemHTML = "";
  if (imagemUrl) {
    imagemHTML = `<img src="${imagemUrl}" class="card-img-top" alt="${servico.titulo}" onerror="this.style.display='none'; this.parentElement.querySelector('.card-img-fallback').style.display='flex';">`;
  }

  const fallbackHTML = `<div class="card-img-fallback card-img-top d-${imagemUrl ? "none" : "flex"} align-items-center justify-content-center bg-light-azul" style="${imagemUrl ? "display: none !important;" : "display: flex !important;"}">
    <i class="bi bi-building" style="font-size: 3rem; color: var(--azul-marinho);"></i>
  </div>`;

  div.innerHTML = `
    <div class="card h-100">
      <div style="position: relative; width: 100%; height: 250px; background-color: var(--azul-claro); display: flex; align-items: center; justify-content: center; overflow: hidden;">
        ${imagemHTML}
        ${fallbackHTML}
      </div>
      <div class="card-body">
        <h5 class="card-title">${servico.titulo}</h5>
        <p class="card-text text-truncate">${servico.desc_servico}</p>
        <small class="text-cinza">
          <i class="bi bi-person"></i> ${servico.nome_usuario}
        </small>
      </div>
      <div class="card-footer">
        <div class="rating-display">
          <div class="stars">${estrelas}</div>
          <span>${servico.nota_media ? servico.nota_media.toFixed(1) : "0.0"}</span>
        </div>
        <a href="pages/detalhes-servico.html?id=${servico.id}" class="btn btn-sm btn-outline-primary">
          Ver Detalhes
        </a>
      </div>
    </div>
  `;

  return div;
}

/**
 * Carregar detalhes de um serviço
 */
async function carregarDetalhesServico(id) {
  try {
    const resultado = await buscarServicoPorId(id);

    if (!resultado.sucesso) {
      mostrarAviso(`Erro: ${resultado.erro}`, "danger");
      return null;
    }

    return resultado.dados;
  } catch (erro) {
    console.error("Erro ao carregar detalhes:", erro);
    mostrarAviso("Erro ao carregar detalhes do serviço", "danger");
    return null;
  }
}

/**
 * Carregar meus serviços (apenas prestadores)
 */
async function carregarMeusServicos() {
  try {
    const container = document.getElementById("meus-servicos-container");
    if (!container) return;

    // Exigir autenticação
    if (!exigirAutenticacao()) return;
    if (!exigirPrestador()) return;

    container.innerHTML =
      '<div class="loading"><div class="spinner-border" role="status"></div></div>';

    const resultado = await listarMeusServicos();

    if (!resultado.sucesso) {
      container.innerHTML = `<div class="alert alert-danger">Erro: ${resultado.erro}</div>`;
      return;
    }

    const servicos = resultado.dados;

    if (servicos.length === 0) {
      container.innerHTML = `<div class="alert alert-info">Você não tem serviços cadastrados ainda.</div>`;
      return;
    }

    container.innerHTML = "";
    servicos.forEach((servico) => {
      const linha = criarLinhaServicoTabela(servico);
      container.appendChild(linha);
    });
  } catch (erro) {
    console.error("Erro ao carregar meus serviços:", erro);
  }
}

/**
 * Criar linha de tabela para meus serviços
 */
function criarLinhaServicoTabela(servico) {
  const tr = document.createElement("tr");

  const imagemUrl = servico.imagem_url;
  let imagemHTML = "";

  if (imagemUrl) {
    imagemHTML = `<img src="${imagemUrl}" alt="${servico.titulo}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`;
  }

  const fallbackHTML = `<div style="width: 50px; height: 50px; display: ${imagemUrl ? "none" : "flex"}; align-items: center; justify-content: center; background: linear-gradient(135deg, #0B213E 0%, #1a3a6e 100%); color: white; border-radius: 4px; font-size: 1.2rem;"><i class="bi bi-building"></i></div>`;

  tr.innerHTML = `
    <td>
      <div style="display: flex; align-items: center; gap: 8px;">
        ${imagemHTML}
        ${fallbackHTML}
      </div>
    </td>
    <td><strong>${servico.titulo}</strong></td>
    <td>${servico.desc_servico.substring(0, 50)}...</td>
    <td>${servico.ativo ? '<span class="badge bg-success">Ativo</span>' : '<span class="badge bg-secondary">Inativo</span>'}</td>
    <td>
      <button class="btn btn-sm btn-warning" onclick="abrirEditarServico(${servico.id})">
        <i class="bi bi-pencil"></i> Editar
      </button>
      <button class="btn btn-sm btn-danger" onclick="deletarServicoConfirm(${servico.id})">
        <i class="bi bi-trash"></i> Deletar
      </button>
    </td>
  `;

  return tr;
}

/**
 * Criar novo serviço
 */
async function criarNovoServico(titulo, descricao, idCategoria, arquivo) {
  try {
    if (!titulo || !descricao) {
      mostrarAviso("Título e descrição são obrigatórios", "warning");
      return false;
    }

    const resultado = await criarServico(
      titulo,
      descricao,
      idCategoria,
      arquivo,
    );

    if (!resultado.sucesso) {
      mostrarAviso(`Erro: ${resultado.erro}`, "danger");
      return false;
    }

    mostrarAviso("Serviço criado com sucesso!", "success");
    return true;
  } catch (erro) {
    console.error("Erro ao criar serviço:", erro);
    mostrarAviso("Erro ao criar serviço", "danger");
    return false;
  }
}

/**
 * Deletar serviço com confirmação
 */
async function deletarServicoConfirm(id) {
  if (
    confirm(
      "Tem certeza que deseja deletar este serviço? Esta ação não pode ser desfeita.",
    )
  ) {
    try {
      const resultado = await deletarServico(id);

      if (!resultado.sucesso) {
        mostrarAviso(`Erro: ${resultado.erro}`, "danger");
        return;
      }

      mostrarAviso("Serviço deletado com sucesso!", "success");

      // Recarregar lista
      carregarMeusServicos();
    } catch (erro) {
      console.error("Erro ao deletar:", erro);
      mostrarAviso("Erro ao deletar serviço", "danger");
    }
  }
}

/**
 * Calcular média de avaliações
 */
function calcularMediaAvaliacao(avaliacoes) {
  if (avaliacoes.length === 0) return 0;

  const soma = avaliacoes.reduce((total, av) => {
    return (
      total +
      (av.nota_preco +
        av.nota_tempo_execucao +
        av.nota_higiene +
        av.nota_educacao) /
        4
    );
  }, 0);

  return (soma / avaliacoes.length).toFixed(1);
}
