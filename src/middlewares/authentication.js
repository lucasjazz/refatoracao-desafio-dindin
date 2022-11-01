const knex = require('../connection');
const jwt = require('jsonwebtoken');
const senhaToken = require('../apiKey');

async function verificarUsuario(req, res, next) {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ mensagem: 'Não autorizado.' })
    }

    try {
        const token = authorization.split(' ')[1];

        const { id } = jwt.verify(token, senhaToken);

        const usuario = await knex('usuarios').where({ id });

        if (usuario.length < 1) {
            return res.status(401).json({ mensagem: 'Usuário não encontrado.' })
        }
        req.usuario = usuario[0];
        next();
    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' })
    }
}

module.exports = {
    verificarUsuario,
}