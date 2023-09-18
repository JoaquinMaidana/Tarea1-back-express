const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const bodyParser = require('body-parser');
const app = express();
app.set('view engine', 'ejs');
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: '*' }
});


const usuario = require('./routes/usuario.route.js');
const partida = require('./routes/partida.route.js');

//conexion mongo
var mongoose = require('mongoose');
var dev_db_url =
'mongodb+srv://joacomaidana11:cleopatra21@cluster0.lfppq2o.mongodb.net/tarea1';
var mongoDB = dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
var AuthController = require('./auth/AuthController');
const { link } = require('fs');
app.use('/api/auth', AuthController);


app.use('/usuarios', usuario);
app.use('/partidas', partida);


const lobbyIO = io.of('/lobby');
lobbyIO.on('connection', (socket) => {
  console.log('Se ha conectado un cliente al lobby');
  

    socket.broadcast.emit('chat_message', {
        usuario: 'INFO',
        mensaje: 'Se ha conectado un nuevo usuario'
    });

    socket.on('chat_message', (data) => {
        lobbyIO.emit('chat_message', data);
    });
});

//let currentPlayer = null;
//let playerX = null;
//let idjugadorX = null;
//let idjugadorO = null;
//const gameIO = io.of('/game');
//gameIO.on('connection', (socket) => {
//    
 //   if (currentPlayer === null) {
// //       currentPlayer = 'X'; // El primer jugador en conectarse será 'X'
//       // gameIO.emit('playerX', indice);
//    } else if (currentPlayer === 'X') {
//        currentPlayer = 'O'; // El segundo jugador en conectarse será 'O'
//    } else {
//        // Puedes manejar más jugadores si es necesario
//    }
//    console.log("te toca la posicion"+currentPlayer);
 //   console.log('Se ha conectado un cliente al juego'+socket.handshake.query.nickname);
//    console.log(' id'+socket.handshake.query.id);
//
//   
//    // Lógica específica del juego aquí
 //   socket.on('jugada', (indice) => {
 //       gameIO.emit('jugada', indice);
//    });
//
 //   if(currentPlayer == 'X'){
//    
//        idjugadorX = socket.handshake.query.id;
//        playerX = socket.handshake.query.nickname;
//        gameIO.emit('posicion', {
//           posicion: currentPlayer,
//           jugador: playerX,
//           idJugador:  idjugadorX
//        });
//    }else{
//    //    playerO = {
//    //        nickname: socket.handshake.query.nickname,
//     //       id: socket.handshake.query.id
 //   //    }
//        gameIO.emit('posicion', {
//            posicion: currentPlayer,
//            jugador: socket.handshake.query.nickname,
//            jugadorX:playerX,
//            idJugador: socket.handshake.query.id,
//            idJugadorX: idjugadorX
//        });
//    }
//    
//    
//
 //   //evento finalizar,
//    socket.on('finalizar', () => {
//        
//    });
//});
  

const juegos = {};
let jugador = null;
let currentPlayer = null;
const gameIO = io.of('/game');
gameIO.on('connection', (socket) => {
  const sala = socket.handshake.query.sala; // Obtener el número de sala desde la consulta
  
  // Crear la sala si no existe
  if (!juegos[sala]) {
    juegos[sala] = {
      jugadores: [],
      currentPlayer: null,
    };
  }

  let juegoActual = juegos[sala];
  socket.join(sala);
  console.log("se conecto el jugador con nickname"+socket.handshake.query.nickname);
  console.log("sala"+socket.handshake.query.sala);
  // Asignar a los jugadores a la sala
  if (juegoActual.jugadores.length === 0) {
    juegoActual.currentPlayer = 'X';
    currentPlayer = juegoActual.currentPlayer; // El primer jugador en conectarse será 'X'
    jugador = {
        idJugadorX: socket.handshake.query.id,
        nickname: socket.handshake.query.nickname,
        posicion: currentPlayer,
    };
    gameIO.to(sala).emit('posicion', {
        posicion: currentPlayer,
        jugador: jugador.nickname,
        idJugador:  jugador.idJugadorX
    });
  } else if (juegoActual.jugadores.length === 1) {
    juegoActual.currentPlayer = 'O';
    currentPlayer = juegoActual.currentPlayer; // El segundo jugador en conectarse será 'O'
     jugador = {
        idJugadorO: socket.handshake.query.id,
        nickname: socket.handshake.query.nickname,
        posicion: currentPlayer,
    };
    const jugadorX = juegoActual.jugadores[0]; 
    gameIO.to(sala).emit('posicion', {
        posicion: currentPlayer,
        jugador: socket.handshake.query.nickname,
        jugadorX:jugadorX.nickname,
        idJugador: socket.handshake.query.id,
        idJugadorX: jugadorX.idJugadorX
    });
  }
  console.log("posicion"+juegoActual.currentPlayer)
  

  // Agregar al jugador a la sala y unirlo
  juegoActual.jugadores.push(jugador);

   // Unir al socket a la sala correspondiente


  // Lógica específica del juego aquí
  socket.on('jugada', (indice) => {
    gameIO.to(sala).emit('jugada', indice); // Emitir el evento solo a la sala específica
});

  // Evento para manejar el final del juego o desconexiones
  socket.on('finalizar', () => {
    // Lógica para finalizar el juego o manejar desconexiones
    // Puedes implementar esto según tus necesidades
  });

  // Manejar desconexiones
  socket.on('disconnect', () => {
    // Lógica para manejar desconexiones y limpiar la sala si es necesario
    // Puedes implementar esto según tus necesidades
  });
});
  

const port = process.env.PORT || 1234;
server.listen(port, () => {
    console.log('Servidor arriba en el puerto', port);
});
