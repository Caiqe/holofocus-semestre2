var PFModel = require("../models/PFModel")


function buscar(req, res){
var email = req.query.email;





  PFModel.buscar(email).then((resultado) => {
    if (resultado.length >0) {
      res
        .status(200)
        .json(resultado[0]);
    } else {
      console.log("esse email não existe")
      
    }
  }).catch((erro) => {
    console.log("erro na busca:", erro);
    res.status(500).json(erro)
  })

}


function editar(req, res){
var genero = req.body.genero;
var taxa = req.body.taxa
var aspecto1 = req.body.aspecto1
var aspecto2 = req.body.aspecto2
var aspecto3 = req.body.aspecto3
var aspecto4 = req.body.aspecto4
var id = req.query.id;





  PFModel.editar(id, genero, taxa, aspecto1, aspecto2, aspecto3, aspecto4).then((resultado) => {
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