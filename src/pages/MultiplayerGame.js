import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { receiveMultiplayerBoard, receiveMultiplayerEndScreen, receivePlayers, receivePlayersResponse, socket } from './socket';
import { Box, Typography, Button } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import GenerateAvatar from './GenerateAvatar';
import CustomAudioPlayer from './CustomAudio';

function MultiplayerGame() {
    const navigate = useNavigate();
    const location = useLocation();
    const { room } = location.state || {};
    const [songs,setSongs]=useState([]);
    const [songQuestion,setSongQuestion]=useState(0);
    const [correctSong,setCorrectSong] = useState([]);
    const [selectedChoice, setSelectedChoice]= useState(null); 
    const [correctChoice, setCorrectChoice] = useState(null);
    const [players, setPlayers] = useState({});
    const [playerResponse, setPlayerResponse] = useState({});
    useEffect(() => {
        const handleBeforeUnload = (event) => {
          event.preventDefault();
          event.returnValue = ''; 
        };
      
        window.addEventListener('beforeunload', handleBeforeUnload);
      
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const checkSongChoice = (song,index) =>{
        console.log("song choice",song, correctSong["title"])
        if(selectedChoice!=null){
            return;
        }
        setSelectedChoice(index);
        setCorrectChoice(song === correctSong["title"]);
        const user = socket.id;
        const correct = song === correctSong["title"]
        socket.emit("recordMultiplayerChoice", {user,room,correct});
    };
    const resetChoices = () =>{
        if(songQuestion>=9){
          navigate("/endscreen");
        }
        // setSongQuestion(songQuestion+1);
        setSelectedChoice(null);
    }
    useEffect(()=>{
        socket.emit("readyMultiplayerClient",{room});
        receivePlayers((data)=>{
            setPlayers(data);
        })
        receivePlayersResponse((data)=>{
            setPlayerResponse(data);
            console.log("this is the data",data);
        })
        receiveMultiplayerBoard((data)=>{
            console.log("this is the data",data);
            setSongs(data.songChoices);
            setCorrectSong(data.correctSong);
            setSongQuestion(data.index);
            resetChoices();
        })
        receiveMultiplayerEndScreen((data)=>{
            navigate("/endscreen",{state:{multiscore:data}});
        });

    },[]);
    useEffect(()=>{
        console.log("players",players);
    },[players]);
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
            {correctSong && correctSong.preview && (
                <Box>
                    <CustomAudioPlayer src={correctSong.preview} />
                </Box>
            )}
            
            <Box sx={{display:'flex', justifyContent:(Object.keys(players).length>=5)?'flex-start':'center', width:'280px',overflowX:(Object.keys(players).length>=5)?'scroll':'none'}}>
                {players.length!=0 && Object.keys(players).map((key,index)=>{
                    const playerAnswers =playerResponse[key];
                    const borderColor = playerAnswers && (songQuestion)< playerAnswers.length ? playerAnswers[songQuestion] ? 'green' :'red' :'transparent';
                    console.log("inside border",borderColor,songQuestion);
                    return (
                        <div key={key} style={{borderBottom:`10px solid ${borderColor}`,margin: '0 10px'}}>
                            <GenerateAvatar username={players[key]} />
                        </div>
                    )
                })}
            </Box>

            <Box alignItems="center" sx={{height:'400px', width:'100vw'}}>
                {correctSong&& songs && correctSong.length!=0 && songs.length!=0 &&(
                    <Box display="flex" justifyContent="center" alignItems="center"
                        flexWrap='wrap'
                        sx={{
                        height:'40vh',
                        overflowY:'auto',
                        width:'100%',
                        }}
                    >
                        {songs.map((song,index)=>(
                        <Card 
                            key={index} 
                            sx={{ 
                                width: '180px' , 
                                flexShrink: 0,
                                '&:hover':{
                                    // boxShadow:'0px 0px 20px 5px aliceblue'
                                    boxShadow: (selectedChoice==null) ? "0px 0px 20px 5px aliceblue " :(selectedChoice === index) ? correctChoice ? '0px 0px 20px 5px green' :'0px 0px 20px 5px red' : 'none' ,
                                },
                                boxShadow: (selectedChoice === index) ? correctChoice ? '0px 0px 20px 5px green' :'0px 0px 20px 5px red' : 'none',
                                backgroundColor:'white',
                                padding:'7px',
                                borderRadius:'15px',
                                margin:'10px',
                            }}>
                            <CardActionArea onClick={(e)=>{
                                checkSongChoice(song["title"],index);
                            }}>
                            <CardMedia 
                                component="img"
                                height="200"
                                image={song["album"]["cover_big"]}
                                sx={{
                                    borderRadius:'15px'
                                }}
                            />
                            <CardContent sx={{color:'#020202'}}>
                                <Typography gutterBottom variant="h5" component="div"
                                sx={{
                                    height:'clamp(40px, 50px , 50px)',
                                    fontSize: 'clamp(11px, 1.2rem, 1.5rem)',
                                    display:'flex',
                                    justifyContent:'center',
                                    alignItems:'flex-start',
                                    fontWeight:'700',
                                    overflowY:'auto'
                                }}
                                >
                                {song["title"]}
                                </Typography>
                            </CardContent>
                            </CardActionArea>
                        </Card>
                        ))}
                    </Box>
                )}    
                <h1 style={{display: (selectedChoice!=null) ? 'block':'none', color:'white'}}>Waiting ...</h1>
            </Box>
        </Box>
    )
}

export default MultiplayerGame