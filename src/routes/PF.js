var express = require("express");
var router = express.Router();

var pfController = require("../controllers/PFController")


router.get("/buscar", function (req, res){
    pfController.buscar(req,res);
});
router.put("/editar", function (req, res){
    pfController.editar(req,res);
});

module.exports = router;