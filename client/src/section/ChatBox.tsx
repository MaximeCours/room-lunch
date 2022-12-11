import {useContext, useEffect, useState} from "react";
import {SocketContext} from "@Context/socketContext";

interface MessageType{
  user: string
  text: string
}

function ChatBox(){
  const socket = useContext(SocketContext)

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<MessageType[]>([])

  useEffect(() => {
    if (socket){
      socket.on("message", (msg: MessageType) => {
        setMessages((messages) => [...messages, msg]);
      })
    }
  }, [socket])

  const handleSendMessage = () => {
    if (socket){
      socket.emit('sendMessage', message)
      setMessage('')
    }
  }

  return <div className="chatBox">
    <h2>Chat socket</h2>
    <ul>
      {messages.map((msg, index) => {
        return <li key={index}>{`${msg.user}: ${msg.text}`}</li>
      })}
    </ul>

    <input type="text" value={message} onChange={(e) => setMessage(e.target.value)}/>
    <button onClick={handleSendMessage}>Envoyer</button>
  </div>
}

export default ChatBox
