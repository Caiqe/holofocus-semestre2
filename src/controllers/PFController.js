var PFModel = require("../models/PFModel")


function buscar(req, res){






  PFModel.buscar().then((resultado) => {
    if (resultado.length >0) {
      res
        .status(200)
        .json(resultado);
    } else {
      console.log("tabela vazia ou inexistente")
      
    }
  }).catch((erro) => {
    console.log("erro na busca:", erro);
    res.status(500).json(erro)
  })

}


function editar(req, res){
var genero = req.body.genero;
var taxa_min = req.body.taxa_min
var taxa_max = req.body.taxa_max
var aspecto1 = req.body.aspecto1
var aspecto2 = req.body.aspecto2
var aspecto3 = req.body.aspecto3
var aspecto4 = req.body.aspecto4
var perfil = req.body.perfil;
var fkEmpresa = req.query.fk
var idPerfil = req.query.id





  PFModel.editar( genero, taxa_min, taxa_max, aspecto1, aspecto2, aspecto3, aspecto4, perfil, idPerfil, fkEmpresa).then((resultado) => {
    if (resultado.affectedRows >0) {
      res.status(200).json({mensagem: "edição bem sucedida"});
    } else {
      res.status(200).json({mensagem: "edição mal sucedida"});
      
    }
  }).catch((erro) => {
    console.log("erro na edição:", erro);
    res.status(500).json(erro)
  })

}

module.exports = {buscar, editar};