require('./config/config');


const express = require('express');
const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

// Obtener datos
app.get('/usuario', function (req, res) {
  res.json('get usuario');
});

// Guardar registros nuevos
app.post('/usuario', function (req, res) {
    let body = req.body;

    if(body.nombre === undefined){
        res.status(400).json({
            ok: false,
            message: 'El nombre es necesario',
        })
    } else{
        res.json({
            persona:body,
        });
    }

});

// Put actualizar datos
app.put('/usuario/:id', function(req, res){
    let id = req.params.id;

    res.json({
        id,
    })
});

// Borra un dato
app.delete('/usuario', function(req, res){
    res.json('delete usuario');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto:', process.env.PORT);
});