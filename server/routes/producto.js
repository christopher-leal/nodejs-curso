const express = require('express');
const app = express();
const {
    verificaToken
} = require('../middlewares/autenticacion');

let Producto = require('../models/producto');

/**
 * Obtener todos los producto
 */
app.get('/producto', verificaToken, (req, res) => {
    //traer todos los producto
    //populate: usuario categoria
    //paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);
    Producto.find({
            disponible: true
        })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productos) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });
        });
});
/**
 * Obtener un producto por ID
 */
app.get('/producto/:id', verificaToken, (req, res) => {
    //populate: usuario categoria
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No existe el id'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        });

});
/**
 * Buscar productos
 */
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    Producto.find({
            nombre: regex,
            disponible: true
        })
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No existe el id'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        });

});
/**
 * Crear un producto 
 */
app.post('/producto', verificaToken, (req, res) => {
    //grabar el usuario
    //grabar una categoria
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    })
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            producto: productoDB
        })
    })
});
/**
 * Actualizar un producto por ID
 */
app.put('/producto/:id', verificaToken, (req, res) => {
    let body = req.body;
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, body, {
        new: true
    }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe el id del producto'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });
});
/**
 * Borrar un producto por ID
 */
app.delete('/producto/:id', verificaToken, (req, res) => {
    //disponible a false
    let id = req.params.id;
    Producto.findByIdAndUpdate(id, {
        disponible: false
    }, {
        new: true
    }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe el id del producto'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoDB,
            message: 'Producto borrado'
        });
    });
});



module.exports = app