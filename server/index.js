//Necessary dependencies
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

//Created the router separately
const router = require('./router'); 

const app = express(); //Initialised from express
const server = http.createServer(app); //Server on the app initialized above
const io = socketio(server); //Instace of the socket.io  

//Cors is a trust origin policy, if not added, on deplyoment some of the sockets/requests may not get accepted
//Cors is a package for providing a connect/express middleware that can be used to enable CORS (Cross-Origin resource sharing) 
app.use(cors());
app.use(router); //Calling the router as a middleware

//io.on is a built in method,
//Works when we have a client connection on our io instance
//There's also a callback function, which has a socket   
io.on('connect', (socket) => {

  //Connects to the socket.emit used in the frontend, using the string 'join'
  socket.on('join', ({ name, room }, callback) => {

    //addUser returns either an error or the user added 
    const { error, user } = addUser({ id: socket.id, name, room });

    //addUser returns an error, the error handling is dynamically happenning by the error message inside addUser in users.js 
    if(error) return callback(error);

    //If there's no error, we call another built in socket func called .join which 
    socket.join(user.room) ;

    //Admin generated messages using socket.emit: here 'message' is an event
    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

    //Logic to see what users are in the room:
    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
 
    //So that the callback in the front-end socket.on gets called everytime and if there are no errors, the if stat wont run
    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });

  //There's a special built in disconnect, for clinets leaving
  //We are going to remove the user, when he leaves/refresh
  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      //We can also modify the state when the user leaves, send a new message to 'roomData'
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    }
  })
});

//Get our server running, by specifiying the port
//For deplyoment, server will require a specific port which will be inside process.env.PORT
server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));