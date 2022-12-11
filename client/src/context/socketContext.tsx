import {createContext, FC, PropsWithChildren, useEffect, useState} from "react";
import io, {Socket} from "socket.io-client";

const SocketContext = createContext<Socket|null>(null)

const SocketProvider: FC<PropsWithChildren> = ({ children }) => {
  const [ws, setWebsocket] = useState<Socket|null>(null)

  useEffect(() => {
    const socket = io("http://localhost:3000/")

    setWebsocket(socket)
    return () => {
      socket!.close()
      setWebsocket(null)
    }
  }, [])

  return (
    <SocketContext.Provider value={ws}>
      {children}
    </SocketContext.Provider>
  )
}

export { SocketContext, SocketProvider }
