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

      const ganador = await Usuario.findById(req.body.ganador);
      if(!ganador){
          return  res.json("El ganador con ese id no existe");
      }

      
      const partida = new Partida({       
        jugadorX: usuarioX._id,
        jugadorO: usuarioO._id,
        ganador: ganador._id
      });

      // Guardar el producto
      const savedPartida = await partida.save();
      
      const populatedPartida = await Partida.findById(savedPartida._id)
            .populate('jugadorX jugadorO ganador')
            .exec();

        res.json(populatedPartida);

      
    } catch (err) {
      console.log(err); // Imprimir el error en la consola para depuración
      return next(err); // Pasar el error al manejador de errores
    }
};
//trae todas las partidas, totales
exports.partida_get = async function (req, res, next) {
  try {
    let query = Partida.find();
    
    // Verifica si se proporcionó el parámetro "orden"
    if (req.query.orden === 'descendente') {
      query = query.sort({ fecha: -1 }); // Ordenar por fecha en orden descendente
    } else {
      query = query.sort({ fecha: 1 }); // Ordenar por fecha en orden ascendente (predeterminado)
    }

    // Verifica si se proporcionó el parámetro "limite"
    if (req.query.limite) {
      const limite = parseInt(req.query.limite, 10);
      query = query.limit(limite); // Limitar los resultados al valor proporcionado
    }

    const partidas = await query
      .populate('jugadorX jugadorO ganador')
      .exec();

    res.json(partidas);
  } catch (err) {
    console.log(err); // Imprimir el error en la consola para depuración
    return next(err); // Pasar el error al manejador de errores
  }
};

exports.jugadores_mas_partidas_ganadas = async function (req, res, next) {
  try {
    const jugadoresMasPartidasGanadas = await Partida.aggregate([
      {
        $group: {
          _id: '$ganador', // Agrupar por ganador
          totalPartidasGanadas: { $sum: 1 }, // Contar las partidas ganadas
        },
      },
      {
        $lookup: {
          from: 'usuarios', // El nombre de la colección de usuarios
          localField: '_id',
          foreignField: '_id',
          as: 'jugador',
        },
      },
      {
        $unwind: '$jugador', // Deshacer el arreglo de jugadores
      },
      {
        $sort: { totalPartidasGanadas: -1 }, // Ordenar en orden descendente por partidas ganadas
      },
    ]);

    res.json(jugadoresMasPartidasGanadas);
  } catch (err) {
    console.log(err);
    return next(err);
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

