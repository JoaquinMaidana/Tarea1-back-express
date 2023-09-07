var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PartidaSchema = new Schema({
  ganador: {type: String, required: false, max: 100},
  jugadorX: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario'
        },
  jugadorO: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario'
        },
                
});

module.exports = mongoose.model('Partida', PartidaSchema);