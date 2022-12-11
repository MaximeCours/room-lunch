export default interface MarkerNoId{
  type: "restaurant" | "user" | "finish"
  position: number[]
  draggable: boolean
  room: string
  userId?: string
}
