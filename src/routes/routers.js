const express = require('express');
const categorias = require('../controllers/categorias')
const transacoes = require('../controllers/transacoes');
const usuarios = require('../controllers/usuarios');
const { verificarUsuario } = require('../middlewares/authentication')
const { conferirId } = require('../middlewares/conferense')
const rotas = express();

rotas.post('/login', usuarios.login)
rotas.get('/listausuarios', usuarios.listarUsuarios)
rotas.post('/usuario', usuarios.cadastrarUsuario);

rotas.use(verificarUsuario);

rotas.get('/usuario', usuarios.detalharUsuario);
rotas.put('/usuario/:id', conferirId, usuarios.atualizarUsuario);

rotas.get('/categorias', categorias.listarCategorias);

rotas.get('/transacao/extrato', transacoes.extratoTransacao);
rotas.get('/transacao', transacoes.listarTransacao);
rotas.get('/transacao/:id', transacoes.detalharTransacao);
rotas.post('/transacao', transacoes.cadastrarTransacao);
rotas.put('/transacao/:id', transacoes.atualizarTransacao);
rotas.delete('/transacao/:id', transacoes.deletarTransacao);

module.exports = rotas;
