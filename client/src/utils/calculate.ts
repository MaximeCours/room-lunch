import {MarkerType} from "@Types";

/**
 * @param distance (km)
 * @param speed (km/h)
 * @return time (hours)
 */
export const getTime = (distance: number, speed = 5): number => {
  return distance/speed
}

/**
 *
 * @param point1
 * @param point2
 */
export const getDistance = (point1: MarkerType, point2: MarkerType): number => {
  const R = 6371e3
  const [lat1, long1] = point1.position as number[]
  const [lat2, long2] = point2.position as number[]

  const lat1Rad = lat1 * Math.PI/180
  const lat2Rad = lat2 * Math.PI/180

  const deltaRad = (lat2-lat1) * Math.PI/180
  const deltaLong = (long2-long1) * Math.PI/180

  const a = Math.sin(deltaRad/2) * Math.sin(deltaRad/2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) *
    Math.sin(deltaLong/2) * Math.sin(deltaLong/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return (R*c)/1000
}

export const getTravel = (point1: MarkerType, point2: MarkerType, point3: MarkerType): number => {
  return getDistance(point1, point2) + getDistance(point2, point3)
}

/**
 *
 * @param time in hours
 */
export const formatHours = (time: number) => {
  const timeInMinutes = time * 60
  const hours = ~~(timeInMinutes / 60)
  const minutes = Math.round(timeInMinutes % 60)


  return `${hours ? hours + "h": ""}${minutes ? minutes + "min": ""}`
}
