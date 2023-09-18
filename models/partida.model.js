var mongoose = require('mongoose');
var moment = require('moment-timezone'); // Importa moment-timezone
const dateFormat = require('mongoose-date-format');
var Schema = mongoose.Schema;
var PartidaSchema = new Schema({
     
   jugadorX: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario'
        },
   jugadorO: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario'
        },
   ganador: { 
         type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario'
      },
      fecha: {
            type: Date,
            default: () => moment().tz("America/Montevideo").format('YYYY-MM-DD HH:mm:ss')
          }
            
   });

   PartidaSchema.plugin(dateFormat);

   
module.exports = mongoose.model('Partida', PartidaSchema);