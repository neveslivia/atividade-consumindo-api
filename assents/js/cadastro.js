'use strict';
let modoEdicaoId = null;
const limparFormulario = () =>{
    document.getElementById('endereco').value = '';
    document.getElementById('bairro').value = '';
    document.getElementById('cidade').value = '';
    document.getElementById('estado').value = '';
}


const preencherFormulario = (endereco) =>{
    document.getElementById('endereco').value = endereco.logradouro;
    document.getElementById('bairro').value = endereco.bairro;
    document.getElementById('cidade').value = endereco.localidade;
    document.getElementById('estado').value = endereco.uf;
}


const eNumero = (numero) => /^[0-9]+$/.test(numero);

const cepValido = (cep) => cep.length == 8 && eNumero(cep); 

const pesquisarCep = async() => {
    limparFormulario();
    
    const cep = document.getElementById('cep').value.replace("-","");
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    if (cepValido(cep)){
        const dados = await fetch(url);
        const endereco = await dados.json();
        if (endereco.hasOwnProperty('erro')){
            document.getElementById('endereco').value = 'CEP não encontrado!';
        }else {
            preencherFormulario(endereco);
        }
    }else{
        document.getElementById('endereco').value = 'CEP incorreto!';
    }
     
}

document.getElementById('cep')
        .addEventListener('focusout',pesquisarCep);


        
fetch('http://localhost:8080/api/rh/funcionarios', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
    addlinha(data);
})
.catch(error => {
    console.log(error)
});

function addlinha(dadosAPI) {
  const tabela = document.getElementById('tabelaCorpo');
  tabela.innerHTML = ''; 

  dadosAPI.forEach(element => {
    const linha = document.createElement('tr');
   linha.innerHTML = `
  <td class="px-4 py-2">${element.id}</td>
  <td class="px-4 py-2">${element.nome}</td>
  <td class="px-4 py-2">${element.email}</td>
  <td class="px-4 py-2">${element.senha}</td>
  <td class="px-4 py-2">${element.cep}</td>
  <td class="px-4 py-2">${element.endereco}</td>
  <td class="px-4 py-2">${element.numero}</td>
  <td class="px-4 py-2">${element.bairro}</td>
  <td class="px-4 py-2">${element.cidade}</td>
  <td class="px-4 py-2">${element.estado}</td>
  <td class="px-4 py-2 space-x-2">
    <button class="bg-yellow-500 text-white px-2 py-1 rounded"
      onclick='prepararEdicao(
        ${element.id},
        ${JSON.stringify(element.nome)},
        ${JSON.stringify(element.email)},
        ${JSON.stringify(element.senha)},
        ${JSON.stringify(element.cep)},
        ${JSON.stringify(element.endereco)},
        ${JSON.stringify(element.numero)},
        ${JSON.stringify(element.bairro)},
        ${JSON.stringify(element.cidade)},
        ${JSON.stringify(element.estado)}
      )'>Editar</button>
    <button class="bg-red-500 text-white px-2 py-1 rounded"
      onclick="removerFuncionario(${element.id})">Remover</button>
  </td>
`;

    tabela.appendChild(linha);
  });
}

function cadastrar(event) {
  event.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();
  const cep = document.getElementById('cep').value.trim();
  const endereco = document.getElementById('endereco').value.trim();
  const numero = document.getElementById('numero').value.trim();
  const bairro = document.getElementById('bairro').value.trim();
  const cidade = document.getElementById('cidade').value.trim();
  const estado = document.getElementById('estado').value.trim();


  if (nome && email && senha && cep && endereco && numero && bairro && cidade  && estado) {
    fetch('http://localhost:8080/api/rh/funcionarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email,senha,cep,endereco,numero,bairro,cidade,estado })
    })
    .then(response => response.json())
    .then(data => {
      Swal.fire('Sucesso!', 'Cadastro feito com sucesso', 'success');
      addlinha([data]);
      listar();
      document.getElementById('formEndereco').reset();
      
})
    .catch(error => {
      console.error("Erro ao enviar dados:", error);
    });
  } else {
    Swal.fire('Erro!', 'Falta dados para cadastrar', 'error');
  }
}
function editarFuncionario() {
  const id = document.getElementById('id-edicao').value;

  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();
  const cep = document.getElementById('cep').value.trim();
  const endereco = document.getElementById('endereco').value.trim();
  const numero = document.getElementById('numero').value.trim();
  const bairro = document.getElementById('bairro').value.trim();
  const cidade = document.getElementById('cidade').value.trim();
  const estado = document.getElementById('estado').value.trim();

  if (id && nome && email && senha && cep && endereco && numero && bairro && cidade && estado) {
    fetch(`http://localhost:8080/api/rh/funcionarios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha, cep, endereco, numero, bairro, cidade, estado })
    })
    .then(response => {
      if (response.ok) {
        Swal.fire('Atualizado!', 'Funcionário editado com sucesso', 'success');
        listar();
        document.getElementById('formEndereco').reset();
        document.getElementById('id-edicao').value = '';
        document.getElementById('btnCadastrar').classList.remove('d-none');
        document.getElementById('btnAtualizar').classList.add('d-none');
      } else {
        Swal.fire('Erro!', 'Falha ao atualizar funcionário', 'error');
      }
    })
    .catch(error => {
      console.error("Erro ao atualizar:", error);
    });
  } else {
    Swal.fire('Erro!', 'Preencha todos os campos para atualizar', 'error');
  }
}
function prepararEdicao(id, nome, email, senha, cep, endereco, numero, bairro, cidade, estado) {
  document.getElementById('id-edicao').value = id;
  document.getElementById('nome').value = nome;
  document.getElementById('email').value = email;
  document.getElementById('senha').value = senha;
  document.getElementById('cep').value = cep;
  document.getElementById('endereco').value = endereco;
  document.getElementById('numero').value = numero;
  document.getElementById('bairro').value = bairro;
  document.getElementById('cidade').value = cidade;
  document.getElementById('estado').value = estado;

  document.getElementById('btnCadastrar').classList.add('d-none');
  document.getElementById('btnAtualizar').classList.remove('d-none');

  Swal.fire({
    icon: 'info',
    title: 'Modo de edição ativado',
    text: 'Altere os dados e clique em "Atualizar"',
    confirmButtonText: 'OK'
  });
}



document.getElementById('formEndereco').addEventListener('submit', cadastrar);

function removerFuncionario(id) {
  Swal.fire({
    icon: 'question',
    title: 'Você tem certeza?',
    showCancelButton: true,
    confirmButtonText: 'Sim',
    cancelButtonText: 'Não'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`http://localhost:8080/api/rh/funcionarios/${id}`, {
        method: 'DELETE'
      })
      .then(response => {
        if (response.ok) {
          Swal.fire('Removido!', 'Funcionario excluído com sucesso!', 'success');
          listar();
        } else {
          Swal.fire('Erro!', 'Falha ao excluir funcionario.', 'error');
        }
      })
      .catch(error => {
        Swal.fire('Erro!', 'Erro de conexão com o servidor.', 'error');
      });
    } else {
      Swal.fire('Cancelado', '', 'info');
    }
  });
}

function listar() {
  fetch('http://localhost:8080/api/rh/funcionarios', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
  .then(response => response.json())
  .then(data => {
    addlinha(data);
  })
  .catch(error => {
    console.error("Erro ao buscar funcionarios:", error);
  });
}





