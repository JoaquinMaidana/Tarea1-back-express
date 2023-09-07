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
app.use('/api/auth', AuthController);


app.use('/usuarios', usuario);
app.use('/partidas', partida);

// Socket.io
io.on('connection', (socket) => {
    console.log('Se ha conectado un cliente');

    socket.broadcast.emit('chat_message', {
        usuario: 'INFO',
        mensaje: 'Se ha conectado un nuevo usuario'
    });

    socket.on('chat_message', (data) => {
        io.emit('chat_message', data);
    });
});

const port = process.env.PORT || 1234;
server.listen(port, () => {
    console.log('Servidor arriba en el puerto', port);
});
