var express = require('express');
var router = express.Router();
 
var eventosController = require('../controllers/eventosController');

router.post('/criar',function (req, res) {
    eventosController.criar(req, res);
});

router.put('/editar/:id', function(req, res){
    eventosController.editar(req, res);
});

router.delete('/excluir/:id', function(req, res){
    eventosController.excluir(req, res);
});


module.exports = router;