require('./config/config');


const express = require('express');
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

app.use(require('./routes/usuario'));

const conectarDB = () => {
    try{

        mongoose.connect('mongodb://saul_tzakum:_yqwerty123@cluster0-nps0j.mongodb.net/cafe', { useNewUrlParser: true, useUnifiedTopology: true });
    } catch(err){
        throw new Error('Cant connect to DB');
    }
}


app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto:', process.env.PORT);
});