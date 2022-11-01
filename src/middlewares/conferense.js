async function conferirId(req, res, next) {
    const { id } = req.usuario;

    if (Number(id) !== Number(req.params.id)) {
        return res.status(401).json({ mensagem: 'Usuário não autorizado.' })
    }
    next();
}

module.exports = {
    conferirId,
}