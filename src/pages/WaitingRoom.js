import { Box, TextField, Button } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { checkRoomExist, joinRoom, socket } from './socket';
import { useNavigate } from 'react-router-dom';

function WaitingRoom() {
    const navigate = useNavigate();
    const [room, setRoom] = useState('');
    const [inLobby,setInLobby] = useState(1);
    const [joinStatus, setJoinStatus] = useState(false);
    const [gameStarted,setGameStarted]=useState(false);
    
    useEffect(()=>{
        socket.on("roomPopulation",(count)=>{
            setInLobby(count);
        });
        checkRoomExist((data)=>{
            setJoinStatus(data);
        })
    },[]);
    useEffect(() => {
        socket.on("startGame", (data) => {
            console.log("Received startGame:", data);
            setGameStarted(data);
            if (data) {
                console.log("room", room);
                navigate("/multiplayer", { state: { room: room } });
            }
        });
        return () => {
            socket.off("startGame");
        };
    }, [room, navigate]);
    useEffect(()=>{
        console.log("in q",inLobby);
    },[inLobby]);
    return (
        <Box sx={{
            textAlign: 'center',
            height: '100vh',
            width: '100vw',
            backgroundColor: '#161616',
            margin: '0',
            padding: '0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            justifySelf:'center',
            alignSelf:'center',
            alignItems: 'center'
          }}>
            <TextField id="outlined-basic" label="Room Number" variant='standard' onChange={(e)=>{setRoom(e.target.value)}}
                sx={{
                    '& .MuiInputBase-input': {
                    color: 'white',
                    },
                    '& .MuiInputLabel-root': {
                    color: 'white',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                        color: 'white',
                    },
                    '& .MuiInput-underline:before': {
                    borderBottomColor: 'white',
                    },
                    '& .MuiInput-underline:hover:before': {
                    borderBottomColor: 'white',
                    },
                    '& .MuiInput-underline:after': {
                    borderBottomColor: 'white',
                    },
                    display:joinStatus?'none':'block'
                }} 
            />
            <Button variant='contained'
                sx={{backgroundColor: '#4caf50',
                    color: 'white',
                    '&:hover': {
                        backgroundColor: '#388e3c', // Darker green on hover
                    },
                    display:joinStatus?'none':'block'
                }}
                onClick={()=>{joinRoom(room);}}
            >Join Room</Button>
            <Box sx={{display:joinStatus? 'block':'none'}}>
                 <h1 style={{color:'white'}}>Waiting for the HOST to start game.</h1>
                <h1 style={{color:'white'}}>Current Participants: {inLobby}</h1>
            </Box>
        </Box>
    )
}

export default WaitingRoom