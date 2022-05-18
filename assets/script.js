const baseURL = "http://localhost:3000/publicacoes";

const msgAlert = document.querySelector("#msg-alert");

// GetAll Publicações
async function findAllPublicacoes() {
  const response = await fetch(`${baseURL}/all-publicacoes`);

  const publicacoes = await response.json();

  publicacoes.forEach(function (publicacao) {
    document.querySelector(".Publicacoes").insertAdjacentHTML(
      "beforeEnd",
      `
      <div class="PublicacaoContainer" id="PublicacaoContainer_${publicacao._id}">
        <div class="PublicacaoHeader">
          <img src="${publicacao.foto}" alt="">

          <div class="NomeAndHora">
            <h2>${publicacao.nome}</h2>
            <h3>${publicacao.dataHora}</h3>
          </div>
        </div>

        <div class="PublicacaoMain">
          <h3>${publicacao.texto}</h3>
        </div>

        <div class="PublicacaoFooter">
          <button class="default-button" id="btnEditar" onclick="abrirModal('${publicacao._id}')">Editar</button>
          <button class="default-button" id="btnApagar" onclick="abrirModalDelete('${publicacao._id}')">Apagar</button>
        </div>
      </div>

      `
    );
  });
}

// GetById Publicação
async function findByIdPublicacoes() {
  const id = document.querySelector("#idPublicacao").value;

  if (id === "") {
    localStorage.setItem("message", "Digite um ID para pesquisar!");
    localStorage.setItem("type", "danger");

    msgAlert.innerText = localStorage.getItem("message");
    msgAlert.classList.add(localStorage.getItem("type"));
    closeMessageAlert();

    return;
  }

  const response = await fetch(`${baseURL}/one-publicacao/${id}`);
  const publicacao = await response.json();

  if (publicacao.message != undefined) {
    localStorage.setItem("message", publicacao.message);
    localStorage.setItem("type", "danger");

    msgAlert.innerText = localStorage.getItem("message");
    msgAlert.classList.add(localStorage.getItem("type"));
    closeMessageAlert();

    return;
  }

  const publicacaoEscolhidaDiv = document.querySelector(
    "#publicacaoEscolhidaDiv"
  );

  publicacaoEscolhidaDiv.innerHTML = `
      <h2 id="PublicacaoEscolhida">Publicação Escolhida</h2>

      <div class="PublicacaoContainer" id="PublicacaoContainer_${publicacao._id}">
        <div class="PublicacaoHeader">
          <img src="${publicacao.foto}" alt="">

          <div class="NomeAndHora">
            <h2>${publicacao.nome}</h2>
            <h3>${publicacao.dataHora}</h3>
          </div>
        </div>

        <div class="PublicacaoMain">
          <h3>${publicacao.texto}</h3>
        </div>

        <div class="PublicacaoFooter">
          <button class="default-button" id="btnEditar" onclick="abrirModal('${publicacao._id}')">Editar</button>
          <button class="default-button" id="btnApagar" onclick="abrirModalDelete('${publicacao._id}')">Apagar</button>
        </div>
      </div>
  `;
}

// Abrir Modal
async function abrirModal(id = "") {
  if (id != "") {
    document.querySelector("#title-header-modal").innerText =
      "Atualizar publicação";
    document.querySelector("#btnFormModal").innerText = "Atualizar";

    const response = await fetch(`${baseURL}/one-publicacao/${id}`);
    const publicacao = await response.json();

    document.querySelector("#nome").value = publicacao.nome;
    document.querySelector("#dataHora").value = publicacao.dataHora;
    document.querySelector("#texto").value = publicacao.texto;
    document.querySelector("#foto").value = publicacao.foto;
    document.querySelector("#id").value = publicacao._id;
  } else {
    document.querySelector("#title-header-modal").innerText =
      "Cadastrar uma publicação";
    document.querySelector("#btnFormModal").innerText = "Cadastrar";
  }
  document.querySelector("#overlayModal").style.display = "flex";
}

// Fechar modal
function fecharModal() {
  document.querySelector(".modal-overlay").style.display = "none";
  document.querySelector("#nome").value = "";
  document.querySelector("#dataHora").value = "";
  document.querySelector("#texto").value = "";
  document.querySelector("#foto").value = "";
}

// Create (POST)
async function createPublicacao() {
  const id = document.querySelector("#id").value;
  const nome = document.querySelector("#nome").value;
  const dataHora = document.querySelector("#dataHora").value;
  const texto = document.querySelector("#texto").value;
  const foto = document.querySelector("#foto").value;

  const publicacao = {
    id,
    nome,
    dataHora,
    texto,
    foto,
  };

  const modoEdicaoAtivado = id != 0;

  const endpoint =
    baseURL +
    (modoEdicaoAtivado ? `/update-publicacao/${id}` : `/create-publicacao`);

  const response = await fetch(endpoint, {
    method: modoEdicaoAtivado ? "put" : "post",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(publicacao),
  });

  const novaPublicacao = await response.json();

  const html = `<div class="PublicacaoContainer" id="PublicacaoContainer_${publicacao._id}">
  <div class="PublicacaoHeader">
  <img src="${novaPublicacao.foto}" alt="">

    <div class="NomeAndHora">
      <h2>${novaPublicacao.nome}</h2>
      <h3>${novaPublicacao.dataHora}</h3>
    </div>
  </div>

  <div class="PublicacaoMain">
    <h3>${novaPublicacao.texto}</h3>
  </div>

  <div class="PublicacaoFooter">
    <button class="default-button" id="btnEditar" onclick="abrirModal('${publicacao._id}')">Editar</button>
    <button class="default-button" id="btnApagar" onclick="abrirModalDelete(${publicacao._id})">Apagar</button>
  </div>
</div>`;

  if (modoEdicaoAtivado) {
    localStorage.setItem("message", "Publicação atualizada com sucesso!");
    localStorage.setItem("type", "sucess");

    msgAlert.innerText = localStorage.getItem("message");
    msgAlert.classList.add(localStorage.getItem("type"));
    closeMessageAlert();

    return;
  } else {
    document
      .querySelector(".Publicacoes")
      .insertAdjacentHTML("beforeend", html);
  }

  fecharModal();
  document.location.reload(true);
}

findAllPublicacoes();

function abrirModalDelete(id) {
  document.querySelector("#overlay-modal-delete").style.display = "flex";

  const btnSim = document.querySelector(".btn-delete-yes");

  btnSim.addEventListener("click", function () {
    deletePublicacao(id);
    document.location.reload(true);
  });
}

function fecharModalDelete(id) {
  document.querySelector("#overlay-modal-delete").style.display = "none";
}

async function deletePublicacao(id) {
  const response = await fetch(`${baseURL}/delete-publicacao/${id}`, {
    method: "delete",
    headers: {
      "Content-Type": "application-json",
    },
    mode: "cors",
  });
  const result = await response.json();
  alert(result.message);

  document.querySelector(".Publicacoes").innerHTML = "";

  fecharModalDelete();
  findAllPublicacoes();
}

function closeMessageAlert() {
  setTimeout(function () {
    msgAlert.innerText = "";
    msgAlert.classList.remove(localStorage.getItem("type"));
    localStorage.clear();
  }, 3000);
}
