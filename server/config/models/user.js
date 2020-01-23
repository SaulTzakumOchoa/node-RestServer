const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido',
};


let Schema = mongoose.Schema;

const messageErrorRequire = 'Campo obligatorio';

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, messageErrorRequire],
    },
    email: {
        type: String,
        unique: true,
        required: [true, messageErrorRequire],
    },
    password: {
        type: String,
        required: [true, messageErrorRequire],
    },
    img: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos,
    },
    state: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    }
});

usuarioSchema.methods.toJSON = function() {
    
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

usuarioSchema.plugin(uniqueValidator, {message: '{PATH} debe ser único'});

module.exports = mongoose.model('User', usuarioSchema);