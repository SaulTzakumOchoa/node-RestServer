const express = require('express');
const fs = require('fs');
const path = require('path');
const {verificarTokenImg} = require('../middlewares/auth');

let app = express();

app.get('/imagen/:tipo/:img', verificarTokenImg,(req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImg = path.resolve(__dirname , `../../uploads/${tipo}/${img}`)
    
    if(fs.existsSync(pathImg)){
        return res.sendFile(pathImg);
    } else{
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        return res.sendFile(noImagePath);
    }
})

module.exports = app;