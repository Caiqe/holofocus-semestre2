var PFModel = require("../models/PFModel")


function buscar(req, res){
  // Busca os gêneros usados nos selects de evento e perfil sonoro.
  PFModel.buscar().then((resultado) => {
    res.status(200).json(resultado);
  }).catch((erro) => {
    console.log("erro na busca:", erro);
    res.status(500).json(erro)
  })

}


function editar(req, res){
// Mantém os nomes de campos esperados pela função de modal que já existia.
// Nome do perfil sonoro.
var nome = req.body.nome;
// ID real do gênero escolhido.
var genero = req.body.genero;
// Limite inferior de popularidade.
var taxa_min = req.body.taxa_min
// Limite superior de popularidade.
var taxa_max = req.body.taxa_max
// Pontuações dos quatro aspectos.
var aspecto1 = req.body.aspecto1
var aspecto2 = req.body.aspecto2
var aspecto3 = req.body.aspecto3
var aspecto4 = req.body.aspecto4
// Sigla do perfil.
var perfil = req.body.perfil;
// Empresa proprietária recebida na query string.
var fkEmpresa = req.query.fk
// Perfil selecionado recebido na query string.
var idPerfil = req.query.id





  // Reutiliza a edição de PF para atualizar o perfil selecionado e sua empresa.
  PFModel.editar(nome, genero, taxa_min, taxa_max, aspecto1, aspecto2, aspecto3, aspecto4, perfil, idPerfil, fkEmpresa).then((resultado) => {
    // Confirma se o UPDATE encontrou a linha.
    if (resultado.affectedRows >0) {
      // Informa sucesso ao fetch.
      res.status(200).json({mensagem: "edição bem sucedida"});
    } else {
      // Mantém a resposta prevista pela função antiga quando nada foi alterado.
      res.status(200).json({mensagem: "edição mal sucedida"});
      
    }
  }).catch((erro) => {
    // Registra e devolve a falha da edição.
    console.log("erro na edição:", erro);
    res.status(500).json(erro)
  })

}

module.exports = {buscar, editar};
