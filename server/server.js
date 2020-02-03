require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');

mongoose.Promise = global.Promise;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

// habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

// Configuracion global de rutas
app.use(require('./routes/index'));

const optiosMongoDb = {'useCreateIndex': true, useNewUrlParser: true, useUnifiedTopology: true };

mongoose.connect(process.env.URLDB, optiosMongoDb)
.then(db => {
    console.log('Conexion exitosa');
})
.catch(err => {
    console.log(err);
})

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto:', process.env.PORT);
});