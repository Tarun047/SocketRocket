import logo from './logo.svg';
import './App.css';
import React from 'react'
import { withWaveHeader } from './utils';

function App() {
  const [roomName,setRoomName] = React.useState("testRoom")
  const [messages,setMessages] = React.useState([])
  const [musicSocket,setMusicSocket] = React.useState({})
  let audioCtx;

  const handleMessage = async (evt) => {
      try{
        const data = JSON.parse(evt.data)
        console.log(data)
        if(data['status_update']==='done_playing'){
          setMessages([])
        }
      } catch(e){
        const data = evt.data
        const rawBuffer = await data.arrayBuffer();
        console.log(rawBuffer)
        try{
          if(!audioCtx){
            audioCtx = new AudioContext()
          }
          const soundBuffer = await audioCtx.decodeAudioData(rawBuffer);
          setMessages((prevMsgs,props)=>[...prevMsgs,soundBuffer])
        } catch(e){
          console.log("Error decoding");
          console.log(e)
        }
    }
  }

  React.useEffect(()=>{
    if(messages.length>0){
        console.log("currIdx: ")
        if(!audioCtx){
          audioCtx = new AudioContext()
        }
        let source = audioCtx.createBufferSource()
        source.buffer = messages[messages.length-1]
        source.connect(audioCtx.destination) 
        source.start()
    }
  },[messages])

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

  const startPlayback = () => {
    musicSocket.send(JSON.stringify({
      'message': 'play_song'
    }))
  }

  return (
    <div className="App">
      <button onClick={startPlayback}>Play</button>
      <div>
      {
        messages.length>0?"Now Playing":"Click Play buddy!"
      }
      </div>
    </div>
  );
}

export default App;
