const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');

const port = process.env.PORT || 3002;
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const publicDirectoryPath = path.join(__dirname, '../public');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {addUser,removeUser,getUser,getUsersInRoom} = require('./utils/users');

app.use(express.static(publicDirectoryPath));
// app.get('',(req,res)=>{
//     res.render('index');
// });
//server (emit) -> client(recieve) countUpdated
//client (emit) -> server(recieve) increment

io.on('connection',(socket) => {
    console.log('New socket connection');

    socket.on('join',({username,roomName},callback)=>{
        console.log("checko");
        const {error, user} = addUser({id:socket.id,username,roomName});
        if(error){
            return callback(error);
        }
        socket.join(user.room);    
        socket.emit('chat', generateMessage('Admin','Welcome'));
        socket.broadcast.to(user.room).emit('chat',generateMessage('Admin', user.name + ' has joined'));
        io.to(user.room).emit('roomData',{
            room: user.room,
            users: getUsersInRoom(user.room)
        });
    });
    socket.on('message',(inputMessage,callback)=>{
        const theUser = getUser(socket.id);
        const filter = new Filter();
        if(filter.isProfane(inputMessage)){
           return callback('Bad words not allowed');
        }
        io.to(theUser.room).emit('chat',generateMessage(theUser.name, inputMessage));
        callback();
    });
    socket.on('disconnect',() => {
        const user = removeUser(socket.id);
        if(user){
            io.to(user.room).emit('chat', generateMessage('Admin', user.name + ' has left the room'));
            io.to(user.room).emit('roomData',{
                room: user.room,
                users: getUsersInRoom(user.room)
            });
        }
    });
    socket.on('userLocation',(coords,callback)=>{
        const theUser = getUser(socket.id);
        console.log(theUser);
        io.to(theUser.room).emit('myLocation',generateLocationMessage(theUser.name,coords));
        callback("Location delivered");
    });
})
server.listen(port,()=>{
    console.log('webserver is running on port ' +port);
});