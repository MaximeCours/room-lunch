import { v4 as uuid } from 'uuid';
import Marker from "@Types/Marker";
import MarkerNoId from "@Types/MarkerNoId";


export default class MarkerClass{
  static markers: Marker[] = []

  private static restaurantPostions = [[48.856, 2.322],[48.88, 2.362],[48.853, 2.382]]

  static initMarkers(room: string){
    this.restaurantPostions.forEach((position) => {
      this.addMarker({type: "restaurant", position: position, draggable: true, room: room})
    })
    this.addMarker({type: "finish", position: [48.856, 2.352], draggable: true, room: room})
  }

  static addMarker(marker: MarkerNoId){
    this.markers.push({...marker, uuid: uuid()})
  }

  static getMarkerByRoom(room: string){
    return this.markers.filter(marker => marker.room === room)
  }

  static updateMarker(id: string, position: number[]){
    this.markers = this.markers.map(marker => {
      if (marker.uuid === id) {
        return {...marker, position: position}
      }
      return marker
    })
  }

  static removeMarker(id: string){
    this.markers = this.markers.filter(marker => marker.uuid !== id)
  }

  static removeMarkerByUser(id: string){
    this.markers = this.markers.filter(marker => marker.userId !== id)
  }

  static eraseMarkers(room: string){
    this.markers = this.markers.filter(marker => marker.room !== room)
  }
}
