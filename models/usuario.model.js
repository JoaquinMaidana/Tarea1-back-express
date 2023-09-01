var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UsuarioSchema = new Schema({
    nickname: {type: String, required: true, max: 200},
 
    email: {
        type: String,
        index: true,
        match: /.+\@.+\..+/
    },
       
   password: {type: String , required: true}
});




// Exportar el modelo
module.exports = mongoose.model('Usuario', UsuarioSchema);