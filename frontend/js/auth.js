/**
 * Autenticação - ObraConnect
 * Gerencia login, logout e estado de autenticação
 */

// Estado global de autenticação
let usuarioLogado = null;
let tokenAtual = null;

/**
 * Inicializar autenticação ao carregar página
 */
function inicializarAutenticacao() {
  const token = localStorage.getItem("token");
  const usuario = localStorage.getItem("usuario");

  if (token && usuario) {
    try {
      usuarioLogado = JSON.parse(usuario);
      tokenAtual = token;
      atualizarUIAutenticacao();
    } catch (erro) {
      console.error("Erro ao restaurar autenticação:", erro);
      fazerLogout();
    }
  }
}

/**
 * Fazer login
 */
async function realizarLogin(loginOuEmail, senha) {
  try {
    const resultado = await fazerLogin(loginOuEmail, senha);

    if (!resultado.sucesso) {
      return {
        sucesso: false,
        erro: resultado.erro,
      };
    }

    // Armazenar dados
    const { token, usuario } = resultado.dados;
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(usuario));

    usuarioLogado = usuario;
    tokenAtual = token;

    atualizarUIAutenticacao();

    return {
      sucesso: true,
      usuario,
    };
  } catch (erro) {
    console.error("Erro ao fazer login:", erro);
    return {
      sucesso: false,
      erro: "Erro ao fazer login",
    };
  }
}

/**
 * Registrar novo usuário
 */
async function realizarRegistro(nome, email, senha, login, telefone) {
  try {
    // Validações básicas
    if (!nome || !email || !senha || !login) {
      return {
        sucesso: false,
        erro: "Todos os campos são obrigatórios",
      };
    }

    if (senha.length < 6) {
      return {
        sucesso: false,
        erro: "Senha deve ter pelo menos 6 caracteres",
      };
    }

    const resultado = await registrarUsuario(
      nome,
      email,
      senha,
      login,
      telefone,
    );

    if (!resultado.sucesso) {
      return {
        sucesso: false,
        erro: resultado.erro,
      };
    }

    return {
      sucesso: true,
      mensagem: "Usuário registrado com sucesso! Você pode fazer login agora.",
    };
  } catch (erro) {
    console.error("Erro ao registrar:", erro);
    return {
      sucesso: false,
      erro: "Erro ao registrar usuário",
    };
  }
}

/**
 * Fazer logout
 */
function realizarLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
  usuarioLogado = null;
  tokenAtual = null;
  atualizarUIAutenticacao();

  // Redirecionar para página inicial
  window.location.href = "../index.html";
}

/**
 * Atualizar UI baseado no estado de autenticação
 */
function atualizarUIAutenticacao() {
  const linkLogin = document.getElementById("link-login");
  const linkRegistro = document.getElementById("link-registro");
  const linkPerfil = document.getElementById("link-perfil");
  const linkLogout = document.getElementById("link-logout");
  const linkCadastrarServico = document.getElementById(
    "link-cadastrar-servico",
  );
  const divisorNavbar = document.getElementById("divisor-navbar");
  const nomeusuario = document.getElementById("nome-usuario");

  if (usuarioLogado) {
    // Usuário logado
    if (linkLogin) linkLogin.style.display = "none";
    if (linkRegistro) linkRegistro.style.display = "none";
    if (divisorNavbar) divisorNavbar.style.display = "none";
    if (linkPerfil) linkPerfil.style.display = "block";
    if (linkLogout) linkLogout.style.display = "block";
    if (linkCadastrarServico) linkCadastrarServico.style.display = "block";
    if (nomeusuario) nomeusuario.textContent = usuarioLogado.nome;
  } else {
    // Usuário não logado
    if (linkLogin) linkLogin.style.display = "block";
    if (linkRegistro) linkRegistro.style.display = "block";
    if (divisorNavbar) divisorNavbar.style.display = "none";
    if (linkPerfil) linkPerfil.style.display = "none";
    if (linkLogout) linkLogout.style.display = "none";
    if (linkCadastrarServico) linkCadastrarServico.style.display = "none";
  }
}

/**
 * Exigir autenticação (redireciona para login se não logado)
 */
function exigirAutenticacao() {
  if (!usuarioLogado) {
    mostrarAviso(
      "Você precisa estar logado para acessar essa página",
      "warning",
    );
    setTimeout(() => {
      window.location.href = "pages/login.html";
    }, 1500);
    return false;
  }
  return true;
}

/**
 * Exigir ser prestador
 */
function exigirPrestador() {
  if (
    !usuarioLogado ||
    (usuarioLogado.tipo_usuario !== "prestador" &&
      usuarioLogado.tipo_usuario !== "admin")
  ) {
    mostrarAviso("Apenas prestadores podem acessar essa página", "warning");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
    return false;
  }
  return true;
}

/**
 * Virar prestador
 */
async function tornarPrestadorUsuario() {
  try {
    const resultado = await tornarPrestador();

    if (!resultado.sucesso) {
      mostrarAviso(resultado.erro, "danger");
      return false;
    }

    // Atualizar dados do usuário
    const novosDados = resultado.dados;
    localStorage.setItem("usuario", JSON.stringify(novosDados.usuario));
    localStorage.setItem("token", novosDados.token);

    usuarioLogado = novosDados.usuario;
    tokenAtual = novosDados.token;

    mostrarAviso("Parabéns! Você agora é um prestador!", "success");
    atualizarUIAutenticacao();

    return true;
  } catch (erro) {
    console.error("Erro ao virar prestador:", erro);
    mostrarAviso("Erro ao atualizar para prestador", "danger");
    return false;
  }
}

/**
 * Mostrar aviso/notificação via Modal
 */
function mostrarAviso(mensagem, tipo = "info") {
  // Criar modal dinamicamente
  const modalId = "modal-aviso-" + Date.now();
  const modal = document.createElement("div");
  modal.id = modalId;
  modal.className = "modal fade";
  modal.tabIndex = "-1";
  modal.setAttribute("aria-hidden", "true");

  // Definir cor do título e ícone baseado no tipo
  let icone = "bi-info-circle";
  let titulo = "Informação";
  let corHeader = "info";

  if (tipo === "success") {
    icone = "bi-check-circle";
    titulo = "Sucesso!";
    corHeader = "success";
  } else if (tipo === "danger") {
    icone = "bi-exclamation-circle";
    titulo = "Erro!";
    corHeader = "danger";
  } else if (tipo === "warning") {
    icone = "bi-exclamation-triangle";
    titulo = "Atenção!";
    corHeader = "warning";
  }

  modal.innerHTML = `
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-${corHeader} text-white">
          <h5 class="modal-title">
            <i class="bi ${icone}"></i> ${titulo}
          </h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          ${mensagem}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal">OK</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  const bsModal = new bootstrap.Modal(modal);
  bsModal.show();

  // Remover modal do DOM após fechar
  modal.addEventListener("hidden.bs.modal", () => {
    modal.remove();
  });
}
