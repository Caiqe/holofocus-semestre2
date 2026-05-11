var express = require('express');
var router = express.Router();
 
var eventosController = require('../controllers/eventosController');

router.post('/criar', (req, res) => {
    eventosController.criar(req, res);
});

router.put('/editar/:id', (req, res) => {
    eventosController.editar(req, res);
});

router.delete('/excluir/:id', (req, res) => {
    eventosController.excluir(req, res);
});


module.exports = router;