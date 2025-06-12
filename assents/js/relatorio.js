
async function carregarFiltros() {
  const [funcRes, cargoRes] = await Promise.all([
    fetch('/funcionarios'),
    fetch('/cargos')
  ]);

  const funcionarios = await funcRes.json();
  const cargos = await cargoRes.json();

  const selFuncionario = document.getElementById('filtroFuncionario');
  const selCargo = document.getElementById('filtroCargo');

  selFuncionario.innerHTML = '<option value="">Todos</option>';
  funcionarios.forEach(f => {
    const opt = document.createElement('option');
    opt.value = f.id;
    opt.textContent = f.nome;
    selFuncionario.appendChild(opt);
  });

  selCargo.innerHTML = '<option value="">Todos</option>';
  cargos.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.nome;
    selCargo.appendChild(opt);
  });
}

async function buscarRelatorio(event) {
  event.preventDefault();

  const funcionarioId = document.getElementById('filtroFuncionario').value;
  const cargoId = document.getElementById('filtroCargo').value;

  let url = '/funcionarios-por-cargo';
  const params = [];

  if (funcionarioId) params.push(`funcionarioId=${funcionarioId}`);
  if (cargoId) params.push(`cargoId=${cargoId}`);

  if (params.length > 0) url += '?' + params.join('&');

  const res = await fetch(url);
  const dados = await res.json();
  const tbody = document.getElementById('tabelaRelatorio');
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

carregarFiltros();
