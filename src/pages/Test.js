// import React, { useState, useEffect } from 'react';
// import io from 'socket.io-client';

// const socket = io.connect('http://localhost:4000');

// export default function Test() {
//     const [isConnected, setIsConnected] = useState(socket.connected);
//     const [lastPong, setLastPong] = useState(null);
//     useEffect(() => {

//     }, [socket]);

//     const sendPing = () => {
//         socket.emit('ping');
//     }

//     return (
//         <div>
//             <p>Connected: {'' + isConnected}</p>
//             <p>Last pong: {lastPong || '-'}</p>
//             <button onClick={sendPing}>Send ping</button>
//         </div>
//     );
// }
