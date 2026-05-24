var empresaModel = require("../models/empresaModel");

function buscarPorCnpj(req, res) {
  var cnpj = req.params.cnpj;

  empresaModel.buscarPorCnpj(cnpj).then((resultado) => {
    res.status(200).json(resultado);
  });
}

function buscarEndereco(req, res) {
  var cep = req.body.cepServer;
  var numero = req.body.numeroServer;
  var complemento = req.body.complementoServer;

  empresaModel.buscarEndereco(cep, numero, complemento).then((resultado) => {
    res.status(200).json(resultado);
  });
}

function listar(req, res) {
  empresaModel.listar().then((resultado) => {
    res.status(200).json(resultado);
  });
}

function cadastrar(req, res) {
  var cnpj = req.body.cnpjServer;
  var razaoSocial = req.body.razaoServer;
  var idEndereco = req.body.idEnderecoServer;

  empresaModel.buscarPorCnpj(cnpj).then((resultado) => {
    if (resultado.length > 0) {
      res
        .status(401)
        .json({ mensagem: `a empresa com o cnpj ${cnpj} já existe` });
    } else {
      empresaModel.cadastrar(razaoSocial, cnpj, idEndereco).then((resultado) => {
        res.status(201).json(resultado);
      });
    }
  });
}

function cadastrarEndereco(req, res) {
  var cep = req.body.cepServer;
  var endereco = req.body.logradouroServer;
  var numero = req.body.numeroServer;
  var complemento = req.body.complementoServer;

  empresaModel.buscarEndereco(cep, numero, complemento).then((resultado) => {
    if (resultado.length > 0) {
      res
        .status(401)
        .json({ mensagem: `a empresa com o cep ${cep} já existe` });
    } else {
      empresaModel.cadastrarEndereco(cep, endereco, numero, complemento).then((resultado) => {
        res.status(201).json(resultado);
      });
    }
  });
}

function deletarEmpresa(req, res) {
  let id = req.params.id

  empresaModel.deletarEmpresa(id).then((resultado) => { res.status(200).json(resultado) })
}

function deletarEndereco(req, res) {
  let id = req.params.id

  empresaModel.deletarEndereco(id).then((resultado) => { res.status(200).json(resultado) })
}

module.exports = {
  buscarPorCnpj,
  buscarEndereco,
  cadastrar,
  cadastrarEndereco,
  listar,
  deletarEmpresa,
  deletarEndereco
};
