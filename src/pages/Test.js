// import React, { useEffect, useState } from "react";
// import io from "socket.io-client";

// const socket = io.connect("http://localhost:4000");

// function App() {
//     const [room, setRoom] = useState("");
//     const [message, setMessage] = useState("");
//     const [receivedMsg, setReceivedMsg] = useState("");

//     const joinRoom = () => {
//         if (room !== "") {
//             socket.emit("join_room", room);
//         }
//     };

//     const sendMessage = () => {
//         socket.emit("send_message", { message, room });
//     };

//     useEffect(() => {
//         socket.on("connect", () => {
//             console.log("Connected to server");
//         });

//         socket.on("receive_message", (data) => {
//             setReceivedMsg(data);
//         });

//         return () => {
//             socket.off("connect");
//             socket.off("receive_message");
//         };
//     }, []);

//     return (
//         <div className="App">
//             <input
//                 placeholder="Room Number..."
//                 onChange={(event) => {
//                     setRoom(event.target.value);
//                 }}
//             />
//             <button onClick={joinRoom}>Join Room</button>
//             <input
//                 placeholder="Message..."
//                 onChange={(event) => {
//                     setMessage(event.target.value);
//                 }}
//             />
//             <button onClick={sendMessage}>Send Message</button>
//             <h1>Message:</h1>
//             <div>Message: {receivedMsg && receivedMsg.message}</div>
//             <div>Room: {receivedMsg && receivedMsg.room}</div>
//         </div>
//     );
// }

// export default App;
