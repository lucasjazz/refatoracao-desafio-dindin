const knex = require('../connection');

async function listarCategorias(req, res) {
  try {
    const listar = await knex('categorias');
    return res.status(200).json(listar)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ mensagem: 'Erro interno do servidor' })
  }
}


module.exports = {
  listarCategorias,
}