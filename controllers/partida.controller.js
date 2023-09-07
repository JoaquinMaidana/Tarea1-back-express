var mongoose = require('mongoose');

const Usuario = require('../models/usuario.model');
const Partida = require('../models/partida.model');

exports.test = function (req, res) {
 res.send('test partida');
};

//igual esto no va a tener un endpoint creo

exports.partida_create = async function (req, res, next) {
    try {
      const usuarioX = await Usuario.findById(req.body.idUsuarioX);
      if(!usuarioX){
          return  res.json("El usuario X con ese id no existe");
      }
      const usuarioO = await Usuario.findById(req.body.idUsuarioO);
      if(!usuarioO){
          return  res.json("El usuario O con ese id no existe");
      }

      
      const partida = new Partida({       
        jugadorX: usuarioX._id,
        jugadorO: usuarioO._id,
        
      });

      // Guardar el producto
      const savedPartida = await partida.save();
      
      const populatedPartida = await Partida.findById(savedPartida._id)
            .populate('jugadorX jugadorO')
            .exec();

        res.json(populatedPartida);

      res.json(savedPartida);
    } catch (err) {
      console.log(err); // Imprimir el error en la consola para depuración
      return next(err); // Pasar el error al manejador de errores
    }
};

exports.partida_get = async function (req, res, next) {
    try {
      const partidas = await Partida.find()
          .populate('jugadorX jugadorO')
          .exec();

      res.json(partidas);
  } catch (err) {
      console.log(err); // Imprimir el error en la consola para depuración
      return next(err); // Pasar el error al manejador de errores
  }
};

//para setear el ganador de una partida
exports.partida_update = async function (req, res, next) {
  try {
    const updatedPartida = await Partida.findByIdAndUpdate(
      req.params.id,
      { ganador: req.body.ganador }, // Actualiza el campo "ganador" con el valor del cuerpo de la solicitud
      { new: true }
    ).exec();

    res.send(updatedPartida);
  } catch (err) {
    return next(err);
  }
};

