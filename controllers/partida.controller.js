var mongoose = require('mongoose');
const Product = require('../models/product.model');
const Usuario = require('../models/usuario.model');
const Compra = require('../models/compra.model');

exports.test = function (req, res) {
 res.send('test compra');
};



exports.compra_create = async function (req, res, next) {
    try {
      const producto = await Product.findById(req.body.idProducto);
      if(!producto){
          return  res.json("El producto con ese id no existe");
      }
      const usuario = await Usuario.findById(req.body.idUsuario);
      if(!usuario){
          return  res.json("El usuario con ese id no existe");
      }

      const monto = req.body.cantidad * producto.price ;
      const compra = new Compra({       
        producto: producto._id,
        usuario: usuario._id,
        cantidad: req.body.cantidad,
        monto: monto
      });

      // Guardar el producto
      const savedCompra = await compra.save();
      
      const populatedCompra = await Compra.findById(savedCompra._id)
            .populate('producto usuario')
            .exec();

        res.json(populatedCompra);

      res.json(savedCompra);
    } catch (err) {
      console.log(err); // Imprimir el error en la consola para depuración
      return next(err); // Pasar el error al manejador de errores
    }
};

exports.compra_get = async function (req, res, next) {
    try {
      const compras = await Compra.find()
          .populate('producto usuario')
          .exec();

      res.json(compras);
  } catch (err) {
      console.log(err); // Imprimir el error en la consola para depuración
      return next(err); // Pasar el error al manejador de errores
  }
};

exports.compra_usuario = async function (req, res, next) {
    try {
      const idUsuario = req.params.idUsuario;

      // Buscar todas las compras del usuario con el ID proporcionado y poblar solo el producto
      const compras = await Compra.find({ usuario: idUsuario })
          .populate('producto')
          .select('-usuario')  // Excluir el campo 'usuario'
          .exec();

      res.json(compras);
  } catch (err) {
      console.log(err); // Imprimir el error en la consola para depuración
      return next(err); // Pasar el error al manejador de errores
  }
};


exports.compra_producto = async function (req, res, next) {
    try {
      const idProducto = req.params.idProducto;

      // Buscar todas las compras del producto con el ID proporcionado y poblar solo el producto
      const compras = await Compra.find({ producto: idProducto })
          .populate('usuario')
          .select('-producto')  // Excluir el campo 'usuario'
          .exec();

      res.json(compras);
  } catch (err) {
      console.log(err); // Imprimir el error en la consola para depuración
      return next(err); // Pasar el error al manejador de errores
  }
};
 

  //  exports.product_details = async function (req, res) {
  //      var product = await Product.findById(req.params.id).exec();	
  //      res.send(product);
  //  };

