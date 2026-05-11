var dashboard = require('../models/dashboard-marketing')

function carregarKpis(req, res) {
    dashboard.carregarKpis()
        .then(
            function (resp) {
                res.json(resp)
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log(
                    "\nHouve um erro ao registrar a mensagem! Erro: ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            }
        )
}

function carregarGraficoBarras(req, res){
    dashboard.carregarGraficoBarras()
        .then(
            function (resp) {
                res.json(resp)
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log(
                    "\nHouve um erro ao registrar a mensagem! Erro: ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            }
        )
}

function carregarGraficoLinhas(req, res){
    var id = req.params.id_empresa

    dashboard.carregarGraficoLinhas(id)
        .then(
            function (resp) {
                res.json(resp)
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log(
                    "\nHouve um erro ao registrar a mensagem! Erro: ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            }
        )
}

function carregarOportunidades(req, res){
    dashboard.carregarOportunidades()
        .then(
            function (resp) {
                res.json(resp)
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log(
                    "\nHouve um erro ao registrar a mensagem! Erro: ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            }
        )
}

function carregarTabela(req, res){
    var id = req.params.id_genero
    dashboard.carregarTabela(id)
        .then(
            function (resp) {
                res.json(resp)
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log(
                    "\nHouve um erro ao registrar a mensagem! Erro: ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            }
        )
}

function carregarGenerosSelect(req, res) {
    dashboard.carregarGenerosSelect()
        .then(function (resp) {
            res.json(resp);
        })
        .catch(function (erro) {
            console.log(erro);
            console.log('\nHouve um erro ao carregar os gêneros! Erro: ', erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function carregarUltimaAtualizacao(req, res) {
    dashboard.carregarUltimaAtualizacao()
        .then(function (resp) {
            res.json(resp);
        })
        .catch(function (erro) {
            console.log(erro);
            console.log('\nHouve um erro ao carregar a última atualização! Erro: ', erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    carregarGraficoBarras, 
    carregarGraficoLinhas, 
    carregarKpis, 
    carregarOportunidades, 
    carregarTabela,
    carregarGenerosSelect,
    carregarUltimaAtualizacao
}