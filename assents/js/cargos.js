
async function listarCargos() {
  const res = await fetch('http://localhost:8080/api/rh/cargos');
  const dados = await res.json();
  const tbody = document.getElementById('tabelaCargos');
  tbody.innerHTML = '';

  dados.forEach(cargo => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${cargo.id}</td>
      <td>${cargo.nome}</td>
      <td>${cargo.descricao}</td>
      <td>
        <button class="btn btn-sm btn-warning" onclick="editarCargo(${cargo.id}, '${cargo.nome}', '${cargo.descricao}')">Editar</button>
        <button class="btn btn-sm btn-danger" onclick="excluirCargo(${cargo.id})">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function editarCargo(id, nome, descricao) {
  document.getElementById('cargoId').value = id;
  document.getElementById('nome').value = nome;
  document.getElementById('descricao').value = descricao;
}

function limparFormulario() {
  document.getElementById('formCargo').reset();
  document.getElementById('cargoId').value = '';
}

async function excluirCargo(id) {
  if (confirm("Deseja realmente excluir este cargo?")) {
    await fetch(`/cargos/${id}`, { method: 'DELETE' });
    listarCargos();
  }
}

async function salvarCargo(event) {
  event.preventDefault();

  const id = document.getElementById('cargoId').value;
  const nome = document.getElementById('nome').value;
  const descricao = document.getElementById('descricao').value;

  const payload = JSON.stringify({ nome, descricao });

  const options = {
    method: id ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload
  };

  const url = id ? `http://localhost:8080/api/rh/cargos/${id}` : 'http://localhost:8080/api/rh/cargos';

  const res = await fetch(url, options);
  if (res.ok) {
    limparFormulario();
    listarCargos();
  } else {
    alert('Erro ao salvar o cargo.');
  }
}

listarCargos();