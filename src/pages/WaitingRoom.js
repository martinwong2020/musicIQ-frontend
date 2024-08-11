import { Box, TextField, Button } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { checkRoomExist, joinRoom, socket, receivePlayers } from './socket';
import { useNavigate } from 'react-router-dom';
import GenerateAvatar from './GenerateAvatar';

function WaitingRoom() {
    const navigate = useNavigate();
    const [room, setRoom] = useState('');
    const [inLobby,setInLobby] = useState(1);
    const [joinStatus, setJoinStatus] = useState(false);
    const [gameStarted,setGameStarted]=useState(false);
    const [username, setUsername] = useState('');
    const [players,setPlayers] = useState({});

    const checkField = ()=>{
        if(room==""){
            return;
        }
        if(username==""){
            return;
        }
        joinRoom(room,username);
    }
    useEffect(()=>{
        socket.on("roomPopulation",(count)=>{
            setInLobby(count);
        });
        checkRoomExist((data)=>{
            setJoinStatus(data);
        })
        receivePlayers((data)=>{
            console.log("players",data);
            setPlayers(data);
        });
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
             <TextField id="outlined-basic" label="Username" variant='standard' onChange={(e)=>{setUsername(e.target.value)}}
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
                onClick={()=>{checkField();}}
            >Join Room</Button>
            <Box sx={{display:joinStatus? 'block':'none'}}>
                 <h1 style={{color:'white'}}>Waiting for the HOST to start game.</h1>
                <h1 style={{color:'white'}}>Current Participants: {inLobby}</h1>
                <Box sx={{display:'flex', justifyContent:'center'}}>
                    {players.length!=0 && Object.keys(players).map((key,index)=>(
                        <GenerateAvatar username={players[key]} />
                    ))}
                </Box>
            </Box>
        </Box>
    )
}

export default WaitingRoom