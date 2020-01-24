// ===================
// Puerto
// ===================

process.env.PORT = process.env.PORT || 3000;

// ===================
// Entorno
// ===================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// ===================
// Base de datos
// ===================
let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost/cafe'    
} else{
    urlDB = 'mongodb://saul_tzakum:_Yqwerty123@cluster0-nps0j.mongodb.net/test'
}
// urlDB = 'mongodb+srv://saul_tzakum:_hola_mundo@cluster0-nps0j.mongodb.net/cafe';
process.env.URLDB = urlDB;