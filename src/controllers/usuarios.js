const knex = require('../connection');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const senhaToken = require('../apiKey');

async function login(req, res) {
    const { email, senha } = req.body;
    if (!email || !senha) {
        return res.status(404).json({ mensagem: 'Email e senha são obrigatórios.' })
    }

    try {
        const validarUsuario = await knex('usuarios').where({ email });
        if (!validarUsuario.length) {
            return res.status(401).json({ mensagem: 'Email ou senha inválidos.' });
        }
        const validarSenha = await bcrypt.compare(senha, validarUsuario.rows[0].senha);
        if (!validarSenha) {
            return res.status(401).json({ mensagem: 'Email ou senha inválidos.' });
        }

        const token = jwt.sign({ id: validarUsuario.rows[0].id }, senhaToken, { expiresIn: '8h' });

        const { senha: _, ...usuarioLogado } = validarUsuario.rows[0];

        return res.status(200).json({ usuarioLogado, token });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}

async function listarUsuarios(req, res) {
    try {
        const listar = await knex('usuarios');
        return res.status(200).json(listar);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}

async function cadastrarUsuario(req, res) {
    const { nome, email, senha } = req.body
    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: "Os campos nome, email e senha são obrigatórios" })
    }
    if (!email.includes('@')) {
        return res.status(400).json({ mensagem: 'Email inválido!' })
    }
    try {
        const verificarEmail = await knex('usuarios').where({ email });
        if (verificarEmail.length) {
            return res.status(400).json({ mensagem: 'Email já cadastrado.' })
        }
        const criptografiaSenha = await bcrypt.hash(senha, 10);
        const novoUsuario = await knex('usuarios').insert({ nome, email, senha: criptografiaSenha }).returning('*');

        return res.status(201).json(novoUsuario[0])
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}

async function detalharUsuario(req, res) {
    const { id } = req.usuario;

    try {
        const detalhar = await knex('usuarios').where({ id });

        if (!detalhar.length) {
            return res.status(404).json({ mensagem: 'usuário não cadastrado.' })
        }
        return res.status(200).json(detalhar)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}

async function atualizarUsuario(req, res) {
    const { nome, email, senha } = req.body;
    const { id } = req.usuario;

    try {
        const verificarId = await knex('usuarios').where({ id });

        if (!verificarId.length) {
            return res.status(404).json({ mensagem: 'usuário não cadastrado.' })
        }
        const criptografiaSenha = await bcrypt.hash(senha, 10);

        if (!nome || !email || !senha) {
            return res.status(400).json({ mensagem: "Os campos nome, email e senha são obrigatórios" })
        }
        if (!email.includes('@')) {
            res.status(400).json({ mensagem: 'Email inválido!' })
        }

        const atualizar = await knex('usuarios').update({ nome, email, senha: criptografiaSenha }).where({ id });
        return res.status(201).json(atualizar[0])
    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}

module.exports = {
    login,
    listarUsuarios,
    cadastrarUsuario,
    detalharUsuario,
    atualizarUsuario,
}