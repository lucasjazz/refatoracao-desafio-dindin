const knex = require('../connection');

async function listarTransacao(req, res) {
    const { id } = req.usuario;
    let { orderBy } = req.query;

    if (!orderBy) {
        orderBy = 'desc'
    }

    const query = `select 
    t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao as categoria_nome
    from 
    transacoes t 
    join 
    categorias c
    on 
    t.categoria_id = c.id
    and
    t.usuario_id = ?
    order by
    t.data
    ${orderBy}`;

    try {
        const listar = await knex.raw(query, [id]).debug()

        return res.status(200).json(listar.rows)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}

async function detalharTransacao(req, res) {
    const { id } = req.usuario;

    try {
        const detalhar = await knex('transacoes').where({ usuario_id: id }).andWhere({ id: req.params.id }).debug();
        if (!detalhar.length) {
            return res.status(404).json({ mensagem: 'Transação não encontrada.' });
        }
        return res.status(200).json(detalhar);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
}

async function cadastrarTransacao(req, res) {
    const { id } = req.usuario;
    const { tipo, descricao, valor, data, categoria_id } = req.body;

    if (!tipo || !descricao || !valor || !data || !categoria_id) {
        return res.status(404).json({ mensagem: 'Todos os campos obrigatórios devem ser informados.' });
    }

    try {
        const queryCategoria = await knex('categorias').where({ id: categoria_id });
        if (!queryCategoria.length) {
            return res.status(404).json({ mensagem: 'Categoria não cadastrada.' });
        }
        const cadastrar = await knex('transacoes').insert({ tipo, descricao, valor: valor * 100, data, categoria_id, usuario_id: id }).returning('*').debug()

        return res.status(200).json(cadastrar);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}

async function atualizarTransacao(req, res) {
    const { id } = req.usuario
    const { tipo, descricao, valor, data, categoria_id } = req.body;
    if (!tipo || !descricao || !valor || !data || !categoria_id) {
        return res.status(404).json({ mensagem: 'Todos os campos obrigatórios devem ser informados.' });
    }
    try {
        const atualizar = await knex('transacoes').update({ tipo, descricao, valor, data, categoria_id }).where({ usuario_id: id }).andWhere({ id: req.params.id }).debug();

        return res.status(204).json(atualizar[0]);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' })
    }
}

async function deletarTransacao(req, res) {
    const { id } = req.usuario;

    try {
        const query = await pool.query('delete from transacoes where id = $1 and usuario_id = $2', [req.params.id, id]);
        if (query.rowCount < 1) {
            return res.status(404).json({ mensagem: 'Transação não encontrada.' })
        }
        return res.status(204).send();
    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
}

async function extratoTransacao(req, res) {
    const { id } = req.usuario;

    try {
        const extratoEntrada = await knex('transacoes').sum('valor').where({ tipo: 'Entrada' }).andWhere({ usuario_id: id })
        const extratoSaida = await knex('transacoes').sum('valor').where({ tipo: 'Saida' }).andWhere({ usuario_id: id })
        const extrato = {
            entrada: Number(extratoEntrada[0].sum) || 0,
            saida: Number(extratoSaida[0].sum) || 0
        }
        return res.status(200).json(extrato)
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
}


module.exports = {
    listarTransacao,
    detalharTransacao,
    cadastrarTransacao,
    atualizarTransacao,
    deletarTransacao,
    extratoTransacao,
}