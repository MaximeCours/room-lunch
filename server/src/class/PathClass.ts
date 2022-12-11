import Path from "@Types/Path";

export default class PathClass{
  static paths: Path[] = []

  static addPath(path: Path){
    this.paths.push(path)
  }

  static getPathByRoom(room: string){
    return this.paths.filter(path => path.room === room)
  }

  static updatePath(editedPath: Path){
    this.paths = this.paths.map(path => {
      if (path.username === editedPath.username){
        return editedPath
      }
      return path
    })
  }

  static removePath(username: string){
    this.paths = this.paths.filter(path => path.username !== username)
  }

  static erasePaths(room: string){
    this.paths = this.paths.filter(path => path.room !== room)
  }
}
