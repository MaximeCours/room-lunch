import {LatLngExpression} from "leaflet";
import MarkerTypeType from "./MarkerTypeType";


export default interface MarkerType{
  uuid: string
  type: MarkerTypeType
  position: LatLngExpression
  draggable: boolean
  room: string
  userId?: string
}
