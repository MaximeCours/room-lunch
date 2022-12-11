import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.scss'
import {SocketProvider} from "@Context/socketContext";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <SocketProvider>
    <App/>
  </SocketProvider>
)
