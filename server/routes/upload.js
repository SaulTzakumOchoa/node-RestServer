const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const {verificarToken} = require('../middlewares/auth')

const Usuario = require('../config/models/user');
const Producto = require('../config/models/productos');

const app = express();

// default options
app.use(fileUpload({useTempFiles: true}));

app.put('/upload/:tipo/:id', verificarToken,function(req, res) {
    
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
  
    //Validar tipo
    let tiposValidos = ['productos', 'usuarios'];

    if(tiposValidos.indexOf(tipo) < 0){
      return res.status(400).send({
        ok: false,
        err: {
          message: 'Los tipos permitidos son: ' + tiposValidos.join(', '),
        }
      })
    }
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;
    
    // Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length-1];
    
    if(extensionesValidas.indexOf(extension) < 0){
      return res.status(400).send({
        ok: false,
        err: {
          message: 'Las extensiones permitidas son: ' + extensionesValidas.join(', '),
        }
      })
    }
    
    // Cambiar nombre al archivo
    let nombreArchivo = `${id}-${new Date().getFullYear()}${new Date().getDay()}${new Date().getHours()}${new Date().getMilliseconds()}.${extension}`;
    
    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
      if (err){
        return res.status(500).send(err);
      }
      
      // Guardar imagen en producto o usuario
      if(tipo === 'productos'){
        
        imgProducto(id, res, nombreArchivo);
      } else{
        
        imgUsuario(id, res, nombreArchivo);
      }
    });
});

function imgUsuario(id, res, nombreArchivo){
  
  Usuario.findById(id, (err, usuarioDB) => {
    if(err){
      borrarArchivo(nombreArchivo, 'usuarios');
      return res.status(500).send({
        ok: false,
        err  
      })
    }
    
    if(!usuarioDB){
      borrarArchivo(nombreArchivo, 'usuarios');
      return res.status(400).send({
        ok: false,
        err: {
          message: 'Usuario inexistente'
        }
      })
    }

    borrarArchivo(usuarioDB.img, 'usuarios');

    usuarioDB.img = nombreArchivo;

    usuarioDB.save((err, usuarioGuardado) => {
      return res.send({
        ok: true,
        usuario: usuarioGuardado,
        img: nombreArchivo
      })
    })
  })
}

function imgProducto(id, res, nombreArchivo){
  Producto.findById(id, (err, productoDB) => {
    if(err){
      borrarArchivo(nombreArchivo, 'productos')
      return res.status(500).send({
        ok: false,
        err,
      })
    }

    if(!productoDB){
      borrarArchivo(nombreArchivo, 'productos');
      return res.status(400).send({
        ok: false,
        err: {
          message: 'Producto no encontrado'
        }
      })
    }    
    
    borrarArchivo(productoDB.img, 'productos');
    productoDB.img = nombreArchivo;

    productoDB.save((err, productoGuardado) => {
      if(err){
        return res.status(500).send({
          ok: false,
          err
        })
      }

      return res.send({
        ok: true,
        producto: productoGuardado,
        img: nombreArchivo
      })
    })
    
  })
}

function borrarArchivo(nombreImg, tipo){
  let pathImg = path.resolve(__dirname , `../../uploads/${tipo}/${nombreImg}`)
  const verificarPath = fs.existsSync(pathImg);

  if(verificarPath){
    fs.unlinkSync(pathImg);
  }
}
module.exports = app;