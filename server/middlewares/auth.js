const jwt = require('jsonwebtoken');

// =================
// Verificar token
// =================

let verificarToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        
        if(err){
            console.log(err);
            
            return res.status(401).json({
                ok:false,
                err: {
                    message: 'Token inválido'
                }
            });
        }

        req.usuario = decoded.data;
        next();
    })
};

// =================
// Verificar admin role
// =================
let verificarAdminRole = (req, res, next) => {
    let usuario = req.usuario;

    if(usuario.role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            ok: false,
            err: {
                message: 'No tienes los permisos suficientes', 
            }
        })
    }    

    next();
};
module.exports = {
    verificarToken,
    verificarAdminRole
}