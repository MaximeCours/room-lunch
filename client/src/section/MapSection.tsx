import {useContext, useEffect, useState} from "react";
import {LeafletEvent} from "leaflet";
import {MapContainer, Polyline, TileLayer} from "react-leaflet";

import {CustomMarker} from "@Components";
import {MarkerType, PathType, UserType} from "@Types";
import {SocketContext} from "@Context/socketContext";

function MapSection() {
  const socket = useContext(SocketContext)

  const [markers, setMarkers] = useState<MarkerType[]>([])
  const [paths, setPaths] = useState<PathType[]>([])

  const [users, setUsers] = useState<UserType[]>([])

  useEffect(() => {
    if (socket){
      socket.on("markers", (markers) => {
        setMarkers(markers)
      })

      socket.on("paths", (paths) => {
        setPaths(paths)
      })

      socket.on("roomUserList", (users: UserType[]) => {
        setUsers(users);
      })
    }
  }, [socket])

  const updatePosition = (id: string, event: LeafletEvent) => {
    if (socket){
      const {lat, lng} = event.target.getLatLng()
      socket.emit("updateMarker", id, [lat, lng])
    }
  }

  return <MapContainer
    className="map"
    center={[48.856, 2.352]}
    zoom={13}
    scrollWheelZoom={false}
  >
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />

    {
      markers.map(marker => {
        return <CustomMarker
          key={marker.uuid}
          position={marker.position}
          type={marker.type}
          eventHandlers={{
            moveend(event) {
              updatePosition(marker.uuid, event)
            }
          }}
          draggable={marker.draggable}
          username={users.find(user => user.id === marker.userId)?.name}
        />
      })
    }

    {
      markers.length > 0 && paths.map((path, index) => {
        const positions = [
          markers.find((marker) => marker.uuid === path.start)!.position,
          markers.find((marker) => marker.uuid === path.restaurant)!.position,
          markers.find(marker => marker.type == "finish")!.position
        ]
        return <Polyline key={index} pathOptions={{color: 'lime'}} positions={positions}/>
      })
    }
  </MapContainer>
}

export default MapSection
