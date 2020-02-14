const express = require('express');
const _ = require('underscore');

let {verificarToken, verificarAdminRole} = require('../middlewares/auth');

let app = express();

let Categoria = require('../config/models/categoria');

// ====================
// Mostrar todas las categorias
// =====================
app.get('/categoria', (req, res) => {
    Categoria.find()
    .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoriasDB) => {
            
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if(!categoriasDB){
                return res.status(400).json({
                    ok:false,
                    err
                })
            }

            res.json({
                ok: true,
                categorias: categoriasDB
            })
        });

});

// ====================
// Mostrar una categoria por ID
// =====================
app.get('/categoria/:id', (req, res) => {
    const id = req.params.id;
    
    Categoria.findById(id, (err, categoriaDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.status(200).json({
            ok: true,
            categoria: categoriaDB,
        })
    })
});

// ====================
// Crear una nueva categoria
// =====================
app.post('/categoria', verificarToken,(req, res) => {
    const body = req.body;
    
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id,
    })

    categoria.save((err, categoriaDB) => {
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.status(200).json({
            ok: true,
            categoria: categoriaDB
        })
    })
});

// ====================
// Actualiza una categoria
// =====================
app.put('/categoria/:id', (req, res) => {
    let body = _.pick(req.body, ['descripcion']);    
    const id = req.params.id;

    Categoria.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, categoriaDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            })
        }

        res.json({
            ok:true,
            message: 'Categoria borrada'
        })
    })
});

// ====================
// Elimina una categoria
// =====================
app.delete('/categoria/:id',[verificarToken, verificarAdminRole] ,(req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, {useFindAndModify: false}, (err, categoriaDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
});

module.exports = app;