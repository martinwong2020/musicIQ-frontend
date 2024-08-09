import io from 'socket.io-client';
export const socket = io("http://localhost:5000");

export const connectSocket = () =>{
    socket.on('connect',()=>{
        console.log('connected to server')
    });
}
export const disconnectSocket = () =>{
    socket.on('disconnect',()=>{
        console.log('disconnected from server');
    })
}

export const joinRoom = (room,username)=>{
    socket.emit("joinRoom",{room,username});
}
export const hostRoom = (room,username)=>{
    socket.emit("hostRoom",{room,username});
}
// export const sendChoice = (choice, room) =>{
//     socket.emit("answerChoice",{choice,room});
// }

export const receiveChoice = (callback) =>{
    socket.on("receiveChoice",(data)=>{
        console.log("frontend choice");
        callback(data.choice);
    })
}

export const checkRoomAvailability = (callback) =>{
    socket.on("hostStatus",(data)=>{
        callback(data);
    })
}
export const checkRoomExist = (callback) =>{
    socket.on("joinStatus",(data)=>{
        callback(data);
    })
}

export const checkGameStart = (callback)=>{
    console.log("inside gameStart")
    socket.on("startGame",(data)=>{
        console.log("inside gameStart")
        callback(data);
    })
}
export const receiveMultiplayerBoard = (callback)=>{
    socket.on("multiplayerGameBoard",(data)=>{
        console.log("data multi received",data);
        callback(data);
    })
}

export const receiveMultiplayerEndScreen = (callback)=>{
    socket.on("multiplayerEndScreen", (data)=>{
        callback(data);
    })
}