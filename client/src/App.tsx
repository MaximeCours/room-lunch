import {useContext, useEffect, useRef, useState} from "react";

import {ChatBox, LeftBarSection, MapSection, RightBarSection} from "@Section"
import {useLocalUserStore} from "@Stores";
import {SocketContext} from "@Context/socketContext";
import {MarkerType, PathType, UserType} from "@Types";
import {formatHours, getDistance, getTime, getTravel} from "@Utils/calculate";

function App() {
  const socket = useContext(SocketContext)

  const [markers, setMarkers] = useState<MarkerType[]>([])
  const [paths, setPaths] = useState<PathType[]>([])
  const [meetTime, setMeetTime] = useState<number | null>(null)

  const usernameInput = useRef<HTMLInputElement>(null)
  const roomNameInput = useRef<HTMLInputElement>(null)

  const {name, room} = useLocalUserStore((state) => state.localUser)
  const setLocalUser = useLocalUserStore((state) => state.setLocalUser)

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log("Client connected !")
      });
    }
  }, [socket])

  console.log(meetTime)

  useEffect(() => {
    if (socket) {
      socket.on("markers", (markers) => {
        setMarkers(markers)
      })

      socket.on("paths", (paths) => {
        setPaths(paths)
      })

      socket.on("meetTime", (meetTime) => {
        setMeetTime(meetTime)
      })
    }
  }, [socket])



  const TimeTravel = () => {
    const myPath = paths.find(path => path.username === name)
    if (markers.length > 0 && myPath) {
      console.log(markers)
      const travelTime = getTime(getTravel(markers.find(marker => marker.uuid === myPath.start)!,
        markers.find(marker => marker.uuid === myPath.restaurant)!,
        markers.find(marker => marker.uuid === myPath.finish)!))
      return <>
        <p>Temps nécessaire : {
          formatHours(travelTime)}</p>
        {meetTime != null && travelTime &&
            <p>Il est recommandé de partir à {formatHours(meetTime-travelTime)} pour arriver à {formatHours(meetTime)}</p>
        }
      </>
    }
    return <></>
  }

  const handleSubmit = () => {
    if (socket && usernameInput?.current?.value && roomNameInput?.current?.value) {
      socket.emit("login", {
        name: usernameInput?.current?.value,
        room: roomNameInput?.current?.value
      }, (user: UserType) => {
        setLocalUser(user)
        socket.emit("askData", room)
      })
    }
  }

  const getContent = () => {
    if (name && room) {
      return <main>
        <header><TimeTravel/></header>
        <LeftBarSection/>
        <MapSection/>
        <RightBarSection/>
        <ChatBox/>
      </main>
    }
    return <div className="form">
      <label htmlFor="username">Nom d'utilisateur</label>
      <input id="username" type="text" ref={usernameInput}/>
      <label htmlFor="roomName">Nom de la room</label>
      <input id="roomName" type="text" ref={roomNameInput}/>
      <button onClick={handleSubmit}>Entrer</button>
    </div>
  }

  return (<>
    {getContent()}
  </>)
}

export default App
