const jwt = require('jsonwebtoken');

/**
 * Verificar token
 */
let verificaToken = (req, res, next) => {
    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'El token no es valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};

/**
 * Verifica AdminRole
 */

let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role != 'ADMIN_ROLE') {
        return res.json({
            ok: false,
            err: {
                message: 'Solo el usuario administrador puede agregar mas usuarios'
            }
        });
    }
    next();
}

/**
 * Verificar token
 */
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'El token no es valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
}

module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenImg
};