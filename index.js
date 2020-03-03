var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
users = [];
connections = [];

app.use(express.static(__dirname + '/public'));



server.listen(process.env.PORT || 2544);
console.log('server is up and running');

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {
    connections.push(socket);

    console.log('connected: %s sockets connected ', connections.length);
    ////disconnect
    socket.on('disconnect', function(data) {
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames;
        connections.splice(connections.indexOf(socket), 1);
        console.log('user disconnected %s Users remaining', connections.length);

    });
    //////send message

    socket.on('send message', function(data) {
        io.sockets.emit('new message',


            {
                msg: data,
                color: "blue",
                user: socket.username
            });

    });
    ///new user
    socket.on('new user', function(data, callback) {
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();

        socket.emit('request', socket.username);
        ///   io.emit('broadcast', socket.username);

    });

    function updateUsernames() {
        io.sockets.emit('get users', users)

    }

});
///});
