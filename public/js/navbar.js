const nivelAcesso = sessionStorage.NIVEL_ACESSO;
const ul = document.getElementById("ul_navbar");
const iconAdmin = document.getElementById("icon__admin");

if (iconAdmin && nivelAcesso != 1) {
  iconAdmin.style.display = "none";
}

if (ul) {
  if (nivelAcesso == 1) {
    ul.innerHTML = `
    
        <li>
              <a href="dashmarketing.html"
                ><img src="./assets/icon/icon-gerencia.png" alt="Icône gerência" />
                <p>Resultados</p></a
              >
        </li>
        <li>
              <a href="meu-estabelecimento.html"
                ><img src="./assets/icon/icon-estabelecimento.svg" alt="Icône estabelecimento" />
                <p>Estabelecimento</p></a
              >
        </li>
        <li>
          <a href="dashboard.html"
            ><img
              src="./assets/icon/icon-dashboard.png"
              alt="Icône dashboard"
            />
            <p>Artistas</p></a
          >
        </li>
        <li>
          <a href="lista-usuario.html"
            ><img src="./assets/icon/icon-usuarios.png" alt="Icône usuários" />
            <p>Usuários</p></a
          >
        </li>
        <li>
          <a href="lista-evento.html"
            ><img
              src="./assets/icon/icon-favoritos.png"
              alt="Icône favoritos"
            />
            <p>Eventos</p></a
          >
        </li>`;
  } else if (nivelAcesso == 2) {
    ul.innerHTML = `<li>
          <a href="dashboard/dashboard.html"
            ><img
              src="./assets/icon/icon-dashboard.png"
              alt="Icône dashboard"
            />
            <p>Artistas</p></a
          >
        </li>
        <li>
          <a href="lista-evento.html"
            ><img
              src="./assets/icon/icon-favoritos.png"
              alt="Icône favoritos"
            />
            <p>Eventos</p></a
          >
        </li>`;
  } else {
    ul.innerHTML = "";
  }
}