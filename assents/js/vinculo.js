
async function carregarFuncionarios() {
  const res = await fetch('/funcionarios');
  const funcionarios = await res.json();
  const select = document.getElementById('funcionario');
  select.innerHTML = '<option value="">Selecione</option>';
  funcionarios.forEach(f => {
    const option = document.createElement('option');
    option.value = f.id;
    option.textContent = f.nome;
    select.appendChild(option);
  });
}

async function carregarCargos() {
  const res = await fetch('/cargos');
  const cargos = await res.json();
  const select = document.getElementById('cargo');
  select.innerHTML = '<option value="">Selecione</option>';
  cargos.forEach(c => {
    const option = document.createElement('option');
    option.value = c.id;
    option.textContent = c.nome;
    select.appendChild(option);
  });
}

async function salvarVinculo(event) {
  event.preventDefault();

  const funcionarioId = document.getElementById('funcionario').value;
  const cargoId = document.getElementById('cargo').value;
  const dataInicio = document.getElementById('dataInicio').value;
  const dataFim = document.getElementById('dataFim').value;
  const detalhes = document.getElementById('detalhes').value;

  const payload = {
    funcionario: { id: funcionarioId },
    cargo: { id: cargoId },
    dataInicio,
    dataFim: dataFim || null,
    detalhes
  };

  const res = await fetch('/funcionarios-por-cargo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (res.ok) {
    Swal.fire('Sucesso', 'Vínculo salvo com sucesso!', 'success');
    document.getElementById('formVinculo').reset();
    listarVinculos();
  } else {
    Swal.fire('Erro', 'Falha ao salvar o vínculo.', 'error');
  }
}

async function listarVinculos() {
  const res = await fetch('/funcionarios-por-cargo');
  const dados = await res.json();
  const tbody = document.getElementById('tabelaVinculos');
  tbody.innerHTML = '';

  dados.forEach(v => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${v.funcionario.nome}</td>
      <td>${v.cargo.nome}</td>
      <td>${v.dataInicio}</td>
      <td>${v.dataFim || '-'}</td>
      <td>${v.detalhes || '-'}</td>
    `;
    tbody.appendChild(tr);
  });
}

carregarFuncionarios();
carregarCargos();
listarVinculos();
