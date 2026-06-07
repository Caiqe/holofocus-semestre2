// Recupera o nível salvo depois da autenticação.
const nivelAcesso = sessionStorage.NIVEL_ACESSO;
// Localiza o espaço em que os links serão montados.
const ul = document.getElementById("ul_navbar");
// Localiza o ícone administrativo quando ele existir na página.
const iconAdmin = document.getElementById("icon__admin");

// O ícone administrativo aparece somente para GESTOR.
if (iconAdmin && nivelAcesso !== "1") iconAdmin.style.display = "none";

// Evita repetir a mesma estrutura HTML para cada item do menu.
const itemMenu = (href, icone, texto) =>
  `<li><a href="${href}"><img src="${icone}" alt="${texto}"><p>${texto}</p></a></li>`;

if (ul) {
  // Cada nível recebe apenas os links relacionados às suas funções.
  if (nivelAcesso === "1") {
    // GESTOR pode acessar administração, cadastros, eventos e chamados.
    ul.innerHTML =
      itemMenu("dashmarketing.html", "./assets/icon/icon-gerencia.png", "Resultados") +
      itemMenu("meu-estabelecimento.html", "./assets/icon/icon-estabelecimento.svg", "Estabelecimento") +
      itemMenu("dashboard-curador.html", "./assets/icon/icon-dashboard.png", "Artistas") +
      itemMenu("lista-usuario.html", "./assets/icon/icon-usuarios.png", "Usuários") +
      itemMenu("lista-evento.html", "./assets/icon/icon-favoritos.png", "Eventos")
  } else {
    // USER mantém os acessos operacionais a artistas, eventos e chamados.
    ul.innerHTML =
      itemMenu("dashboard-curador.html", "./assets/icon/icon-dashboard.png", "Artistas") +
      itemMenu("lista-evento.html", "./assets/icon/icon-favoritos.png", "Eventos");
  }
}
