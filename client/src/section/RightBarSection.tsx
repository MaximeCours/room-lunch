import {useContext, useEffect, useState} from "react";
import {SocketContext} from "@Context/socketContext";
import {UserType} from "@Types";

function RightBarSection(){
  const socket = useContext(SocketContext)

  const [users, setUsers] = useState<UserType[]>([])

  useEffect(() => {
    if (socket){
      socket.on("roomUserList", (users: UserType[]) => {
        setUsers(users);
      })
    }
  }, [socket])

  return <div className="sidebar right">
    <h2>Room</h2>
    <ul>
      {users.map((user, index) => {
        return <li key={index}>{user.name}</li>
      })}
    </ul>
  </div>
}

export default RightBarSection
