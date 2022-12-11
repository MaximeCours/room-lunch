export default interface Marker{
  uuid: string
  type: "restaurant" | "user" | "finish"
  position: number[]
  draggable: boolean
  room: string
  userId?: string
}
