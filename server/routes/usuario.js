const express = require('express');

const bcrypt = require('bcrypt');
const _ = require('underscore');

const app = express();

const Usuario = require('../config/models/user');
const { verificarToken, verificarAdminRole } = require('../middlewares/auth');
// Obtener datos
app.get('/usuario', verificarToken,function (req, res) {

    return res.json({
        usuario: req.usuario,
        nombre: req.usuario.nombre,
        email: req.usuario.email
    })

    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;

    let options = {
        state: true,
    }

    desde = Number(desde);
    limite = Number(limite);

    Usuario.find(options)
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) =>{

            if(err){
                return res.status(400).json({
                    ok:false,
                    err,
                });
            }

            Usuario.countDocuments(options  , (err, conteo) => {
                res.json({
                    ok:true,
                    usuarios,
                    conteo,
                });
            });
            
        })
});

// Guardar registros nuevos
app.post('/usuario', [verificarToken, verificarAdminRole], (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
    });

    usuario.save( (err, usuarioDB) => {
        if(err){
            return res.status(400).json({
                ok:false,
                err,
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB,
        });

    })

});

// Put actualizar datos
app.put('/usuario/:id', [verificarToken, verificarAdminRole], function(req, res){
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'estado', 'role', 'estado', 'google']);

    // Forma 1
    // Usuario.findById(id, (err, usuarioDB) => {

    // });
    console.log(body);
    // Forma 2
    Usuario.findByIdAndUpdate(id, body, {new:true, runValidators: true} ,(err, usuarioDB) => {



        if(err){
            return res.status(400).json({
                ok:false,
                err,
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB,
        });
    });
});

// Borra un dato
app.delete('/usuario/:id',[verificarToken, verificarAdminRole], function(req, res){
    
    let id = req.params.id;
    let cambiarEstado = {
        state:false
    }

    Usuario.findByIdAndUpdate(id,cambiarEstado, {new:true}, (err, resp) => {
        if(err){
            return res.status(400).json({
                ok:false,
                err,
            });
        }

        if(!resp){
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'Usuario no encontrado',
                }
            });
        }

        res.json({
            ok: true,
            usuario: resp,

        });
    });

});

module.exports = app;