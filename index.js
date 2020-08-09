const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);

const Player = require('./src/player.js');
const Battle = require('./src/battle.js');
const testDecks = require('./src/testDecks.js');

players = [];
sockets = [];
battles = [];

io.on('connection', function (socket) {
    const player = new Player();
    const playerID = player.id;
    console.log('a user connected: ', playerID);
    socket.emit('register', player);

    players[playerID] = player;
    sockets[playerID] = socket;

    socket.on('createBattle', () => {
        const battle = new Battle();
        battles[playerID] = battle;
        battle.enterCallbacks.push((data) => socket.emit('enterBattle', data));
        battle.addPlayer(playerID, (data) => socket.emit('battleServer', data));
    });

    socket.on('battleClient', (data) => {
        //socket.emit('battleServer', data);
        battles[playerID].messageOn(data, playerID);
    })
    socket.on('disconnect', function () {
        console.log('user disconnected: ', socket.id);
        delete players[playerID];
        delete sockets[playerID];
        io.emit('disconnect', playerID);
    });


});
app.use(express.static(__dirname + '/public/'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

// catch all other routes
app.use((req, res, next) => {
    res.status(404).json({ message: '404 - Not Found' });
});

// handle errors
app.use((err, req, res, next) => {
    console.log(err.message);
    res.status(err.status || 500).json({ error: err.message });
});

server.listen(process.env.PORT || 33000, () => {
    console.log(`Server started on port ${process.env.PORT || 33000}`);
});

