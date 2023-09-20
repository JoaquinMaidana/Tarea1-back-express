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


    socket.on('gameConnection', (sala) => {
      lobbyIO.emit('gameConnection', sala);
    });
});


  

const juegos = {};
let jugador = null;
let currentPlayer = null;
const gameIO = io.of('/game');
gameIO.on('connection', (socket) => {
  const sala = socket.handshake.query.sala; 
  
  // Crear la sala si no existe
  if (!juegos[sala]) {
    juegos[sala] = {
      jugadores: [],
      currentPlayer: null,
    };
  }

  let juegoActual = juegos[sala];
  socket.join(sala);

  lobbyIO.emit('gameConnection', { sala });
  
  console.log("se conecto el jugador con nickname"+socket.handshake.query.nickname);
  console.log("sala"+socket.handshake.query.sala);
  // Asignar a los jugadores a la sala
  if (juegoActual.jugadores.length === 0) {
    juegoActual.currentPlayer = 'X';
    currentPlayer = juegoActual.currentPlayer; 
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
    currentPlayer = juegoActual.currentPlayer; 
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
  
  

  
  juegoActual.jugadores.push(jugador);

 


  // Lógica específica del juego aquí
  socket.on('jugada', (indice) => {
    gameIO.to(sala).emit('jugada', indice); // Emitir el evento solo a la sala específica
});

  
  socket.on('finalizar', () => {
    if (juegoActual) {

      lobbyIO.emit('gameDisconnection', { sala });

      juegoActual.jugadores.length=0;
      delete juegos[sala];

      console.log("se desconecto de la sala");
      //console.log(juegoActual.jugadores.length);
      gameIO.to(sala).emit('cerroOtro');
    }
  });
});
  

const port = process.env.PORT || 1234;
server.listen(port, () => {
    console.log('Servidor arriba en el puerto', port);
});
