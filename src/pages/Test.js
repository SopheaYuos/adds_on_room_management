import io from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io.connect("http://localhost:4000");

function App() {
    //Room State
    const [room, setRoom] = useState("");

    // Messages States
    const [message, setMessage] = useState("");
    const [messageReceived, setMessageReceived] = useState("");
    const [receivedMsg, setReceivedMsg] = useState("");

    const joinRoom = () => {
        console.log('herer we go')
        if (room !== "") {
            socket.emit("join_room", room);
        }
    };

    const sendMessage = () => {
        socket.emit("send_message", { message, room });
        console.log("Hellol inside send message")
    };
    useEffect(() => {
        socket.on("connection", (data) => {
            setMessageReceived(data.message);
        });
        socket.on('receive_message', (data) => {
            console.log('get called')
            setReceivedMsg(data)
        })
        //fixed the calling event twice next time
        return () => {
            socket.off("connection");
            socket.off('receive_message');
            // socket.disconnect();
        }
    }, [socket]);
    return (
        <div className="App">
            <input
                placeholder="Room Number..."
                onChange={(event) => {
                    setRoom(event.target.value);
                }}
            />
            <button onClick={joinRoom}> Join Room</button>
            <input
                placeholder="Message..."
                onChange={(event) => {
                    setMessage(event.target.value);
                }}
            />
            <button onClick={sendMessage}> Send Message</button>
            <h1> Message:</h1>
            {receivedMsg.message}
            {receivedMsg.room}
        </div>
    );
}

export default App;
