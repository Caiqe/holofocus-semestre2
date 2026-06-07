var empresaModel = require("../models/empresaModel");

function buscarPorCnpj(req, res) {
  // Obtém o CNPJ informado como parte da URL.
  var cnpj = req.params.cnpj;

  // Envia o CNPJ para a consulta parametrizada.
  empresaModel.buscarPorCnpj(cnpj).then((resultado) => {
    // Devolve uma lista vazia ou a empresa encontrada.
    res.status(200).json(resultado);
  });
}

function buscarEndereco(req, res) {
  // Lê os três campos que identificam o endereço no cadastro.
  var cep = req.body.cepServer;
  var numero = req.body.numeroServer;
  var complemento = req.body.complementoServer;

  // Consulta se esse endereço já existe.
  empresaModel.buscarEndereco(cep, numero, complemento).then((resultado) => {
    // Devolve o possível endereço encontrado.
    res.status(200).json(resultado);
  });
}

function listar(req, res) {
  // Retorna empresas com endereço e contadores para montar a tabela administrativa.
  empresaModel.listar().then((resultado) => {
    // Entrega a lista pronta para renderização.
    res.status(200).json(resultado);
  });
}

function buscarPorId(req, res) {
  // Busca completa usada quando uma tela precisa dos dados da empresa e endereço.
  empresaModel.buscarPorId(req.params.id).then((resultado) => {
    // Nenhuma linha significa que o ID não existe.
    if (!resultado.length) return res.status(404).json({ mensagem: "Empresa não encontrada" });
    // Retorna somente a primeira linha porque o ID é único.
    res.status(200).json(resultado[0]);
  // Trata erro de consulta.
  }).catch((erro) => res.status(500).json({ mensagem: erro.sqlMessage || erro.message }));
}

// Retorna os dados resumidos usados na página Meu estabelecimento.
function buscarEstabelecimento(req, res) {
  empresaModel.buscarEstabelecimento(req.params.id).then((resultado) => {
    // Informa quando não existe empresa com esse ID.
    if (!resultado.length) return res.status(404).json({ mensagem: "Empresa não encontrada" });
    // Envia o resumo único da empresa.
    res.status(200).json(resultado[0]);
  // Devolve erros do SELECT.
  }).catch((erro) => res.status(500).json({ mensagem: erro.sqlMessage || erro.message }));
}

function editar(req, res) {
  // Atualiza somente os campos pertencentes à tabela empresa.
  empresaModel.editar(req.params.id, req.body).then((resultado) => {
    // Detecta quando nenhum registro corresponde ao ID.
    if (!resultado.affectedRows) return res.status(404).json({ mensagem: "Empresa não encontrada" });
    // Confirma a atualização.
    res.status(200).json(resultado);
  // Trata falhas como CNPJ duplicado.
  }).catch((erro) => res.status(500).json({ mensagem: erro.sqlMessage || erro.message }));
}

function editarEndereco(req, res) {
  // Endereço possui tabela e rota próprias, por isso é atualizado separadamente.
  empresaModel.editarEndereco(req.params.id, req.body).then((resultado) => {
    // Detecta ID de endereço inexistente.
    if (!resultado.affectedRows) return res.status(404).json({ mensagem: "Endereço não encontrado" });
    // Confirma a atualização.
    res.status(200).json(resultado);
  // Trata erros do UPDATE.
  }).catch((erro) => res.status(500).json({ mensagem: erro.sqlMessage || erro.message }));
}

function cadastrar(req, res) {
  // Lê os campos enviados pelo cadastro original.
  var cnpj = req.body.cnpjServer;
  var razaoSocial = req.body.razaoServer;
  var idEndereco = req.body.idEnderecoServer;

  // Verifica duplicidade antes de inserir porque CNPJ é único.
  empresaModel.buscarPorCnpj(cnpj).then((resultado) => {
    // Impede inserir quando a consulta encontra um CNPJ igual.
    if (resultado.length > 0) {
      res
        .status(401)
        .json({ mensagem: `a empresa com o cnpj ${cnpj} já existe` });
    } else {
      // Insere a empresa usando o endereço obtido na etapa anterior.
      empresaModel.cadastrar(razaoSocial, cnpj, idEndereco).then((resultado) => {
        // Confirma a criação.
        res.status(201).json(resultado);
      });
    }
  });
}

function cadastrarEndereco(req, res) {
  // Lê os dados do endereço enviados pelo formulário.
  var cep = req.body.cepServer;
  var endereco = req.body.logradouroServer;
  var numero = req.body.numeroServer;
  var complemento = req.body.complementoServer;

  // Reaproveita um endereço igual em vez de criar registro duplicado.
  empresaModel.buscarEndereco(cep, numero, complemento).then((resultado) => {
    // Evita inserir um endereço idêntico.
    if (resultado.length > 0) {
      res
        .status(401)
        .json({ mensagem: `a empresa com o cep ${cep} já existe` });
    } else {
      // Cria o endereço quando a busca não encontrou registro igual.
      empresaModel.cadastrarEndereco(cep, endereco, numero, complemento).then((resultado) => {
        res.status(201).json(resultado);
      });
    }
  });
}

function deletarEmpresa(req, res) {
  // Obtém o ID da empresa selecionada.
  let id = req.params.id

  // Executa a exclusão antes de tentar remover o endereço.
  empresaModel.deletarEmpresa(id).then((resultado) => {
    if (!resultado.affectedRows) return res.status(404).json({ mensagem: "Empresa não encontrada" });
    res.status(200).json(resultado)
  }).catch((erro) => res.status(500).json({ mensagem: erro.sqlMessage || erro.message }))
}

function deletarEndereco(req, res) {
  // Obtém o ID do endereço vinculado à empresa excluída.
  let id = req.params.id

  // Remove o endereço que deixou de ser referenciado.
  empresaModel.deletarEndereco(id).then((resultado) => {
    if (!resultado.affectedRows) return res.status(404).json({ mensagem: "Endereço não encontrado" });
    res.status(200).json(resultado)
  }).catch((erro) => res.status(500).json({ mensagem: erro.sqlMessage || erro.message }))
}

module.exports = {
  buscarPorCnpj,
  buscarEndereco,
  cadastrar,
  cadastrarEndereco,
  listar,
  buscarPorId,
  buscarEstabelecimento,
  editar,
  editarEndereco,
  deletarEmpresa,
  deletarEndereco
};
