const express = require('express');
let Producto = require('../config/models/productos');
const {verificarToken} = require('../middlewares/auth')

let app = express();

// ===================
// Obtener productos
// ===================
app.get('/productos', verificarToken,(req, res) => {
    // Trae todos los productos
    // populate: usuario categoria
    // Paginado
    let from = req.query.from || 0;
    let limit = req.query.limit || 5;
    
    from = Number(from);
    limit = Number(limit);

    let options = {
        disponible: true
    }
    Producto.find(options) 
        .skip(from)
        .limit(limit)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            
            if(err){
                return res.status(400).send({
                    ok: false,
                    err
                })
            }
            
            res.send({
                ok: true,
                productos
            })
        })

        
})

// ===================
// Obtener un producto por ID
// ===================
app.get('/productos/:id', (req, res) => {
    // Trae un producto por el id
    // populate: usuario categoria
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if(err){
                res.status(500).send({
                    ok: false,
                    err
                })
            }
            
            if(!productoDB){
                res.status(400).send({
                    ok: false,
                    err:{
                        message: 'Producto no encontrado'
                    }
                })
            }
            res.send({
                ok: true,
                producto: productoDB
            })
        })
})

// ===================
// Buscar productos
// ===================
app.get('/productos/buscar/:termino', verificarToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');
    
    Producto.find({nombre: regex})
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            
            if(err){
                res.status(500).send({
                    ok: false,
                    err
                })
            }
            
            if(!productos){
                res.status(400).send({
                    ok: false,
                    err:{
                        message: 'Producto no encontrado'
                    }
                })
            }

            res.send({
                ok: true,
                productos
            })
         })
})

// ===================
// Crear nuevo producto
// ===================
app.post('/productos', verificarToken,(req, res) => {
    // Grabar el usuario
    // grabar una categoria del listado
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id,
    });

    producto.save((err, productoDB) => {
        if(err){
            res.status(500).send({
                ok: false,
                err,
            })
        }

        res.status(201).send({
            ok: true,
            producto: productoDB
        })
    })
})

// ===================
// Actualizar un nuevo producto
// ===================
app.put('/productos/:id', verificarToken,(req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB)=> {
        if(err){
            res.status(500).send({
                ok:false,
                err
            })
        }

        if(!productoDB){
            res.status(400).send({
                ok:false,
                err: {
                    message: 'Producto no encontrado'
                }
            })
        }

        productoDB.nombre = body.nombre || productoDB.nombre;
        productoDB.precioUni = body.precioUni || productoDB.precioUni;
        productoDB.categoria = body.categoria || productoDB.categoria;
        productoDB.disponible = body.disponible || productoDB.disponible;
        productoDB.descripcion = body.descripcion || productoDB.descripcion;

        productoDB.save((err, productoActualizado) => {
            if(err){
                res.status(500).send({
                    ok: false,
                    err
                })
            }

            res.send({
                ok: true,
                producto: productoActualizado
            })
        })
    })
})

// ===================
// Borrar un producto
// ===================
app.delete('/productos/:id', verificarToken, (req, res) => {
    // Actualizar
    let id = req.params.id;

    Producto.findById(id)
        .exec((err, productoDB) => {
            if(err){
                res.status(500).send({
                    ok: false,
                    err
                })
            }
            
            if(!productoDB){
                res.status(400).send({
                    ok: false,
                    err:{
                        message: 'Producto no encontrado'
                    }
                })
            }
            
            productoDB.disponible = false;

            productoDB.save((err, productoActualizado) => {
                if(err){
                    res.status(500).send({
                        ok: false,
                        err
                    })
                }

                res.send({
                    ok: true,
                    producto: productoActualizado,
                    message: 'Producto borrado'
                })
            })
        })
})

module.exports = app;