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
playersCount = 0;

io.on('connection', function (socket) {
    const player = new Player();
    const playerID = player.id;

    console.log('a user connected: ', playerID);
    socket.emit('register', player);
    socket.emit('battles', getBattles());

    players[playerID] = player;
    sockets[playerID] = socket;
    playersCount++;

    player.name = 'Player ' + playersCount;

    socket.on('createBattle', () => {
        const battle = new Battle();
        battles[battle.id] = battle;
        player.battleID = battle.id;
        battle.enterCallbacks.push((data) => socket.emit('enterBattle', data));
        battle.addPlayer(playerID, (data) => socket.emit('battleServer', data));
        io.emit('battles', getBattles());
    });

    socket.on('joinBattle', battleID => {
        const battle = battles[battleID];
        if (battle && battle.players.length == 1) {
            player.battleID = battleID;
            battle.enterCallbacks.push((data) => socket.emit('enterBattle', data));
            battle.addPlayer(playerID, (data) => socket.emit('battleServer', data));
            io.emit('battles', getBattles());
        }
    });

    socket.on('cancelBattle', () => {
        const battle = battles[battleID];
        if (battle && battle.players.length == 1) {
            player.battleID = battleID;
            battle.enterCallbacks.push((data) => socket.emit('enterBattle', data));
            battle.addPlayer(playerID, (data) => socket.emit('battleServer', data));
            io.emit('battles', getBattles());
        }
    });

    socket.on('battleClient', (data) => {
        if (battles[player.battleID])
            battles[player.battleID].messageOn(data, playerID);
    })
    socket.on('disconnect', function () {
        console.log('user disconnected: ', socket.id);
        //delete players[playerID];
        delete sockets[playerID];
        io.emit('disconnect', playerID);
    });


});

function getBattles() {
    const battleList = [];
    for (let battleID in battles) {
        const battle = battles[battleID];
        const _players = battle.players.map((playerID, ind, arr) => { return { name: players[playerID].name } });
        battleList.push({ id: battle.id, players: _players });
    }
    return battleList;
}
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

