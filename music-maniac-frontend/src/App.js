import logo from './logo.svg';
import './App.css';
import React from 'react'

function App() {
  const [roomName,setRoomName] = React.useState("testRoom")
  const [messages,setMessages] = React.useState([])
  const [text,setText] = React.useState("")
  const [musicSocket,setMusicSocket] = React.useState({})

  
  const handleMessage = (evt) => {
      const data = JSON.parse(evt.data)
      setMessages((prevMsgs,props)=>[...prevMsgs,data])
  }

  React.useEffect(()=>{
    const musicSocket = new WebSocket(
      'ws://'
      + 'localhost:8000'
      + '/ws/chat/'
      + roomName
      + '/'
    );
    musicSocket.onmessage = handleMessage
    setMusicSocket(musicSocket)
  },[])

  const sendMessage = () => {
    musicSocket.send(JSON.stringify({
      'message': text
    }))
  }

  return (
    <div className="App">
      <input type="text" value={text} onChange={(evt)=>setText(evt.target.value)} />
      <button onClick={sendMessage}>Send</button>
      <div>
      {
        messages.map((message,idx)=><div key={idx}> {message.message}</div>)
      }
      </div>
    </div>
  );
}

export default App;
