import {User} from "@Types/User";
import MarkerClass from "./MarkerClass";
import PathClass from "@Class/PathClass";

export class UserClass{
  static users: User[] = []

  static addUser(id: string, name: string, room: string){
    const existingUser = this.users.find(user => user.name.trim().toLowerCase() === name.trim().toLowerCase())

    if (name && room && !existingUser){
      if (this.getUsersByRoom(room).length < 1){
        MarkerClass.eraseMarkers(room)
        PathClass.erasePaths(room)

        MarkerClass.initMarkers(room)
      }
      const newUser = {id, name, room}
      this.users.push(newUser)
      MarkerClass.addMarker({type: "user", position: [48.836, 2.332], draggable: true, room: room, userId: id})
      return newUser
    }
    return {}
  }

  static getUser(id: string){
    return this.users.find(user => user.id === id)
  }

  static getUsersByRoom(room: string){
    return this.users.filter(user => user.room === room)
  }

  static removeUser(id: string){
    const indexToDelete = this.users.findIndex((user) => user.id === id)
    const userToDelete = this.users[indexToDelete]
    if (indexToDelete !== -1){
      this.users.splice(indexToDelete, 1)
      return userToDelete
    }
    return null
  }
}
