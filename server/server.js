require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');

mongoose.Promise = global.Promise;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());
app.use(require('./routes/usuario'));

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