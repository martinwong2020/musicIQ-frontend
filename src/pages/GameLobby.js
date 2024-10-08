import React, { useEffect, useState } from 'react'
import { checkGameStart, checkRoomAvailability, hostRoom, joinRoom, receiveChoice, receivePlayers, sendChoice, socket } from './socket';
import { Box } from '@mui/system';
import { Avatar, Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchArtist } from './ApiHelper';
import axios from 'axios';
import ReactLoading from 'react-loading';
import GenerateAvatar from "./GenerateAvatar.js";
import '../css/scrollbar.css'
function GameLobby() {
    const navigate = useNavigate();
    const backendURL= process.env.REACT_APP_BACKEND_URL;
    const [room,setRoom] =useState('');
    const [artist, setArtist]=useState("");
    const [fieldError,setFieldError]= useState(false);
    const [inLobby,setInLobby] = useState(1);
    const [hostStatus,setHostStatus] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError]=useState('');
    const [insufficientSongs, setInsufficientSongs] = useState(false);
    const [gameStarted,setGameStarted]=useState(false);
    const [username, setUsername] = useState('');
    const [players,setPlayers] = useState({});
    const fetchGameQuestions = async () =>{
        setLoading(true);
        setError('');
        console.log("inside fetchgame")
        try{
            const artistId = await fetchArtist(artist);
            if (!artistId) {
                console.log("inside no artist")
                setError('Artist not found');
                setLoading(false);
                return false;
            }

            const tracksResponse = await axios.get(`${backendURL}/artist/${artistId}/random`);
            console.log("after axios")
            if(tracksResponse.data.length<15){
                setInsufficientSongs(true);
                setLoading(false);
                setError("Artist has too little songs.");
                console.log('less than 15');
                return false;
            }
            const songs =tracksResponse.data;
            let quizSongs=[];
            let remainingSongs=[];
            if(songs.length<30){
                quizSongs=songs.slice(0,10);
                remainingSongs=songs.slice(1);
            }
            else{
                quizSongs=songs.slice(0,10);
                remainingSongs = songs.slice(10);
            }
            console.log("after partition");
            console.log("before sending",{quizSongs,remainingSongs,room});
            socket.emit("gameSetUp",{quizSongs,remainingSongs,room});
        }
        catch (error) {
            console.error("Error fetching songs:", error);
            setError('Error fetching songs');
            setLoading(false);
            return false;
        }
        setLoading(false);
        setError('');
        console.log("finish fetch");
        return true;
    }
    const handleStartGame = ()=>{
        socket.emit("gameStart",room);
    }
    useEffect(()=>{
        socket.on("roomPopulation",(count)=>{
            setInLobby(count);
        });
        checkRoomAvailability((data)=>{
            setHostStatus(data);
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
    const checkFields = async() =>{
        if(room==""){
            setFieldError(true);
            return;
        }
        if(artist==""){
            setFieldError(true);
            return;
        }
        if(username==""){
            setFieldError(true);
            return;
        }
        // if(fetchGameQuestions()){
        //     console.log("in fetching host");
        //     hostRoom(room,username);
        // }
        const fetchStatus = await fetchGameQuestions();
        if(fetchStatus){
            hostRoom(room,username);
        }
        
    }
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
            <div style={{ display: loading ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <ReactLoading type="bars" color="#388e3c" height={80} width={80} />
            </div>

            <Box>
                {(error!='') && (
                    <h1 style={{color:'white'}}>{error}</h1>
                )}
            </Box>
            <Box sx={{
                display: (hostStatus || loading) ? "none": 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                justifySelf:'center',
                alignSelf:'center',
                alignItems: 'center'}}>
                <h1 style={{display: fieldError?'block':'none', color:'#e31212'}}>The following fields must not be empty</h1>
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
                    }} 
                />
                <TextField id="outlined-basic" label="Artist" variant='standard' onChange={(e)=>{setArtist(e.target.value)}}
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
                        marginTop:'20px'
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
                        marginTop:'20px'
                    }} 
                />
                <Button variant='contained'
                    sx={{backgroundColor: '#4caf50',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#388e3c',
                        },
                        marginTop:'20px',
                        display: hostStatus ? "none": 'block',
                    }}
                    onClick={()=>{checkFields();}}
                >Host Room</Button>

            </Box>
            <Box sx={{display:(hostStatus && !loading)? 'flex':'none',flexDirection:'column',alignItems:'center'}}>
                <h1 style={{color:'white'}}>Current Participants: {inLobby}</h1>
                <Box sx={{display:'flex', justifyContent:(Object.keys(players).length>=5)?'flex-start':'center', width:'280px',overflowX:(Object.keys(players).length>=5)?'scroll':'none'}}>
                    {players.length!=0 && Object.keys(players).map((key,index)=>(
                        
                        <GenerateAvatar username={players[key]} />
                    ))}
                </Box>
                {/* <GenerateAvatar username={username} /> */}
                <Button variant='contained'
                    sx={{backgroundColor: '#4caf50',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#388e3c',
                        },
                        marginTop:'20px'
                    }}
                    onClick={()=>{
                        handleStartGame();

                    }}
                >Start Game</Button>
            </Box>
        </Box>
    )
}

export default GameLobby