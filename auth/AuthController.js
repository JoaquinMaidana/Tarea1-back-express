
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var VerifyToken = require('./VerifyToken');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('../models/usuario.model');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config/config');


router.post('/register', async (req, res) => {
    try {
        const hashedPassword = bcrypt.hashSync(req.body.password, 8);
        
        const newUser = await User.create({
            nickname: req.body.nickname,               
            email: req.body.email,
            password: hashedPassword
        });
        


        //el primer parametro es el payload que es lo que queremos que se guarde
        //creamos el access token, para las solicitudes http
        
        //se le agrega solo el id del usuario, se le pueden poner mas campos
        const token = jwt.sign({ id: newUser._id }, config.secret, {
            expiresIn: 86400 // expira en 24 horas
        });
        //se puede crear otro con otro secret para usar como refresh token
        //este ultimo token puede expirar en dias o semanas

        res.status(200).send({ auth: true, token: token });
    } catch (err) {
        console.error(err); // Imprime el error en la consola para depuración
        res.status(500).send("Error");
    }
});

router.get('/me', VerifyToken, async (req, res) => {
    try {
        const token = req.headers['x-access-token'];
        if (!token) return res.status(401).send({ auth: false, message: 'Sin token' });

        const decoded = jwt.verify(token, config.secret);

        const user = await User.findById(decoded.id, { password: 0 });

        if (!user) return res.status(404).send("No existe el usuario.");

        res.status(200).send(user);
    } catch (err) {
        console.error(err); // Imprime el error en la consola para depuración
        res.status(500).send("Error al encontrar usuario.");
    }
});


router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).send('No existe usuario.');
        }

        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

        if (!passwordIsValid) {
            return res.status(401).send({ auth: false, token: null });
        }

        const token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expira en 24 horas
        });

        res.status(200).send({ auth: true, token: token });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al realizar el inicio de sesión.');
    }
});

   router.get('/logout', function(req, res) {
    res.status(200).send({ auth: false, token: null });
   });

   module.exports = router;