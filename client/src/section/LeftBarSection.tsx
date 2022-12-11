import {useContext, useEffect, useState} from "react";
import {LatLngExpression} from "leaflet";

import {useLocalUserStore} from "@Stores";
import {MarkerType, PathType} from "@Types";
import {SocketContext} from "@Context/socketContext";

const restaurantNames = ["Kebab", "Italien", "Boulangerie"]

function LeftBarSection() {
  const socket = useContext(SocketContext)

  const [markers, setMarkers] = useState<MarkerType[]>([])
  const [paths, setPaths] = useState<PathType[]>([])

  const {id, name, room} = useLocalUserStore((state) => state.localUser)

  useEffect(() => {
    if (socket){
      socket.emit("askData", room)
    }
  }, [])

  useEffect(() => {
    if (socket){
      socket.on("markers", (markers) => {
        setMarkers(markers)
      })

      socket.on("paths", (paths) => {
        setPaths(paths)
      })
    }
  }, [socket])


  const restaurantClique = (position: LatLngExpression) => {
    if(socket){
      const data = {
        username: name,
        start: markers.find(marker => marker.userId === id)?.uuid,
        restaurant: markers.find(marker => marker.position === position)?.uuid,
        finish: markers.find(marker => marker.type === "finish")?.uuid,
        room: room
      }
      if (paths.find(path => path.username === name)){
        socket.emit("updatePath", data)
      }else{
        socket.emit("addPath", data)
      }
    }
  }


  return <div className="sidebar left">
    <h2>Restaurants :</h2>
    <ul>
      {
        markers.filter(marker => marker.type === "restaurant").map((restaurant, index) => {
          return <li key={restaurantNames[index]}>
            <button onClick={() => restaurantClique(restaurant.position)}>{restaurantNames[index]}</button>
          </li>
        })
      }
    </ul>
  </div>
}

export default LeftBarSection
