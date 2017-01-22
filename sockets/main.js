/**
 * Created by somveer on 14/1/17.
 */
var User = require('./user.js');
var Board = require('./board.js');
var functions = require('./functions.js');
var connections = [];
var rooms = [];
module.exports = function(io) {
    var app = require('express');
    var router = app.Router();

    io.on('connection', function(socket) {
        connections.push(socket.id);
        console.log("total Connections: %s , new socket connected is %s", connections.length, socket.id);

        // Disconnect
        socket.on('disconnect', function () {
            connections.splice(connections.indexOf(socket.id), 1);
            console.log("Total connections: %s , %s socket disconnected", connections.length, socket.id);
        });

        // new player
        socket.on('new player', function (data) {
            var options = {
                userName : data,
                socketId : socket.id,
                color : functions.getRandomColor()
            };
            socket.emit('add player', options);
        });

        // cell clicked
        socket.on('cell clicked', function(options) {
            io.emit('change color', options);
            io.sockets.emit('block game', options);
        });

        // Join room
        socket.on('join room', function(options){
            if(rooms.indexOf(options.roomId) < 0) {
                console.log("rooms length %s", rooms.length);
                console.log("the socket: %s has joined room number: %s", options.socketId, options.roomId);
                socket.join(options.roomId);
                rooms.push(options.roomId);
            };
        });

        // Create new game
        socket.on('create new game', function(html){
           console.log("creating new game");
           io.sockets.emit('append game', html);
        });

        // Score calculate
        socket.on('score calculate', function (options, count, max) {
            io.to(options.socketId).emit('update score', options, count, max);
        });

        // Max score calculate
        socket.on('max score calculate', function (options, max) {
            io.emit('update max score', options, max);
        });

        // Game over
        socket.on('game over', function (options) {
            io.emit('update winner', options);
        });

    });

    return router;
}