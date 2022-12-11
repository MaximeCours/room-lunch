import express from "express";
import http from "http";
import { Server } from "socket.io"
import {UserClass} from "@Class/UserClass";
import PathClass from "@Class/PathClass";
import MarkerClass from "@Class/MarkerClass";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173"
  }
});

let meetTimes: {time: number, room: string}[] = []

app.get('/', (req, res) => {
  res.send('Server is up and running');
});

io.on('connection', (socket) => {
  socket.on("login", ({name, room}, callback) => {
    console.log(`${name} connected to room : ${room}`)
    if (UserClass.addUser(socket.id, name, room)){
      callback(UserClass.getUser(socket.id))
    }
  })

  socket.on("askData", (room) => {
    socket.join(room)
    io.in(room).emit('roomUserList', UserClass.getUsersByRoom(room))
    io.in(room).emit('markers', MarkerClass.getMarkerByRoom(room))
    io.in(room).emit('paths', PathClass.getPathByRoom(room))
    const meet = meetTimes.find(meetTime => meetTime.room === room)
    if (meet){
      io.in(room).emit('meetTime', meet.time)
    }
  })

  socket.on("sendMessage", message => {
    const user = UserClass.getUser(socket.id)
    if (user){
      console.log(`(${user.room}) User "${user.name}" send message : ${message}`)
      if (message[0] === "/"){
        const [command, argument] = message.split(" ")
        switch (command){
          case "/meet":
            const timeInHours = parseInt(argument.split("h")[0])+parseInt(argument.split("h")[1] || "0")/60
            if(meetTimes.find(meetTime => meetTime.room === user.room)){
              meetTimes[meetTimes.findIndex(meetTime => meetTime.room === user.room)].time = timeInHours
            }else{
              meetTimes.push({time: timeInHours, room: user.room})
            }
            console.log(timeInHours)
            io.in(user.room).emit('meetTime', timeInHours)
            break
        }
      }else{
        io.in(user.room).emit('message', {user: user.name, text: message})
      }
    }
  })

  socket.on("updateMarker", (id: string, position: number[]) => {
    MarkerClass.updateMarker(id, position)
    const room = MarkerClass.markers.find(marker => marker.uuid === id)?.room
    if (room){
      io.in(room).emit('markers', MarkerClass.markers)
    }
  })

  socket.on("addPath", path => {
    PathClass.addPath(path)
    io.in(path.room).emit('paths', PathClass.paths)
  })

  socket.on("updatePath", path => {
    PathClass.updatePath(path)
    io.in(path.room).emit('paths', PathClass.paths)
  })

  socket.on("disconnect", () => {
    const user = UserClass.removeUser(socket.id)
    if (user) {
      console.log(`(${user.room}) User "${user.name}" left`)
      PathClass.removePath(user.name)
      MarkerClass.removeMarkerByUser(user.id)
      io.in(user.room).emit('paths', PathClass.paths)
      io.in(user.room).emit('markers', MarkerClass.markers)
      io.in(user.room).emit('roomUserList', UserClass.getUsersByRoom(user.room))
    }
  })
});
server.listen(3000, () => {
  console.log('Server started on port 3000');
});
