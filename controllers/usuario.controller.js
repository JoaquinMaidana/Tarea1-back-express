const Usuario = require('../models/usuario.model');

exports.test = function (req, res) {
 res.send('Hola usuario');
};


exports.usuario_create = async function (req, res, next) {
    try {
      console.log("El contenido es"+req.body);
      let usuario = new Usuario({
        nickname : req.body.nickname
      });
  
      await usuario.save();
      res.send('Usuario creado ok');
    } catch (err) {
      console.log(err);
      return next(err);
    }
  };

  exports.usuario_get = async function (req, res, next) {
    try {
      const usuarios = await Usuario.find(); 
      res.json(usuarios); 
    } catch (err) {
      return next(err);
    }
  };

  

    exports.usuario_details = async function (req, res) {
        var usuario = await Usuario.findById(req.params.id).exec();	
        res.send(usuario);
    };
  
    exports.usuario_update = async function (req, res) {
        try {
          const updatedUsuario = await Usuario.findByIdAndUpdate(
            req.params.id,
            ...req.body, 
            { new: true } 
          ).exec();
      
          res.send(updatedUsuario);
        } catch (err) {
          return next(err);
        }
      };
  
      exports.usuario_delete = async function (req, res) {
        try {
          const deletedUsuario = await Usuario.findByIdAndRemove(req.params.id).exec();
          res.send(`Usuario eliminado: ${deletedUsuario}`);
        } catch (err) {
          return next(err);
        }
      };