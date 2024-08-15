import React, {useEffect, useState, useRef} from 'react'
import { AppBar, Toolbar, Typography, Button, Container, TextField, Box } from '@mui/material';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import ReactLoading from 'react-loading';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/style.css'
import { connectSocket } from './socket';
import { fetchArtist } from './ApiHelper';
import CustomAudioPlayer from './CustomAudio';
function Game() {
  const location = useLocation();
  const audioRef = useRef(null);
  const navigate = useNavigate();

  const passedArtist = location.state?.artist
  // const [artist, setArtist]=useState('');
  // const [songs,setSongs]=useState([]);
  // const [quizSong,setQuizSong] = useState([]);
  // const [remaingingSong, setRemainingSong]= useState([]);
  // const [error, setError]=useState('');
  // const [loading, setLoading] = useState(false);
  // const [songIndex,setSongIndex]=useState(0);
  // const [songChoices,setSongChoices]=useState([]);
  // const [correctChoice, setCorrectChoice]= useState(null);
  // const [selectedChoice, setSelectedChoice]= useState(null); 
  // const [searchedArtist, setSearchedArtist] = useState(false);
  // const [correctAnswers, setCorrectAnswers] = useState(0);
  // const [insufficientSongs, setInsufficientSongs] = useState(false);

  const savedState = JSON.parse(sessionStorage.getItem('quizState')) || {};

  const [artist, setArtist] = useState(savedState.artist || '');
  const [songs, setSongs] = useState(savedState.songs || []);
  const [quizSong, setQuizSong] = useState(savedState.quizSong || []);
  const [remaingingSong, setRemainingSong] = useState(savedState.remaingingSong || []);
  const [error, setError] = useState(savedState.error || '');
  const [loading, setLoading] = useState(savedState.loading || false);
  const [songIndex, setSongIndex] = useState(savedState.songIndex || 0);
  const [songChoices, setSongChoices] = useState(savedState.songChoices || []);
  const [correctChoice, setCorrectChoice] = useState(savedState.correctChoice || null);
  const [selectedChoice, setSelectedChoice] = useState(savedState.selectedChoice || null);
  const [searchedArtist, setSearchedArtist] = useState(savedState.searchedArtist || false);
  const [correctAnswers, setCorrectAnswers] = useState(savedState.correctAnswers || 0);
  const [insufficientSongs, setInsufficientSongs] = useState(savedState.insufficientSongs || false);
  
  // useEffect(() => {
  //   const savedState = JSON.parse(sessionStorage.getItem('quizState'));
  //   if (savedState) {
  //       setArtist(savedState.artist);
  //       setSongs(savedState.songs);
  //       setQuizSong(savedState.quizSong);
  //       setRemainingSong(savedState.remaingingSong);
  //       setError(savedState.error);
  //       setLoading(savedState.loading);
  //       setSongIndex(savedState.songIndex);
  //       setSongChoices(savedState.songChoices);
  //       setCorrectChoice(savedState.correctChoice);
  //       setSelectedChoice(savedState.selectedChoice);
  //       setSearchedArtist(savedState.searchedArtist);
  //       setCorrectAnswers(savedState.correctAnswers);
  //       setInsufficientSongs(savedState.insufficientSongs);
  //   }
  // }, []);
  useEffect(() => {
    const state = {
        artist,
        songs,
        quizSong,
        remaingingSong,
        error,
        loading,
        songIndex,
        songChoices,
        correctChoice,
        selectedChoice,
        searchedArtist,
        correctAnswers,
        insufficientSongs
    };
    sessionStorage.setItem('quizState', JSON.stringify(state));
  }, [
        artist, 
        songs, 
        quizSong, 
        remaingingSong, 
        error, 
        loading, 
        songIndex, 
        songChoices, 
        correctChoice, 
        selectedChoice, 
        searchedArtist, 
        correctAnswers, 
        insufficientSongs
  ]);
  const parseSongList = () =>{
    console.log("songs",songs);
    if(songs.length<30){
      setQuizSong(songs.slice(0,10));
      setRemainingSong(songs.slice(1));
      return;
    }
    setQuizSong(songs.slice(0,10));
    setRemainingSong(songs.slice(10));
    
  }
  const fetchSongs = async () => {
    if(artist==''){
      return;
    }
    setSearchedArtist(true);
    setLoading(true);
    setError('');
      try {
          // Fetch artist ID
          const artistId = await fetchArtist(artist);

          if (!artistId) {
              setError('Artist not found');
              setLoading(false);
              setSearchedArtist(false);
              return;
          }

          // Fetch top 10 tracks for the artist
          const tracksResponse = await axios.get(`http://localhost:5000/artist/${artistId}/random`);
          if(tracksResponse.data.length<15){
            // setError("Less than 15 songs");
            setInsufficientSongs(true);
            console.log("Artist has less than 15 songs.");
            setSearchedArtist(false);
            setLoading(false);
            setError('Artist does has less than 15 songs to use.');
            return;
          }
          setSongs(tracksResponse.data);
          setError('');
          setInsufficientSongs(false);
      } catch (error) {
          console.error("Error fetching songs:", error);
          setError('Error fetching songs');
      }
    setError('');
    setLoading(false);
  };
  const ShuffleSongChoices = ()=>{
    let array = [quizSong[songIndex],remaingingSong[songIndex],remaingingSong[songIndex+1]];
    return array.sort(() => Math.random() - 0.5);
  }
  const checkSongChoice = (value,index) =>{
    if(selectedChoice!=null){
      return;
    }
    setSelectedChoice(index);
    setCorrectChoice(value === quizSong[songIndex]["title"]);
    if(value === quizSong[songIndex]["title"]){
      setCorrectAnswers(correctAnswers+1);
    }
  }
  const resetChoices = () =>{
    console.log("song index",songIndex);
    if(songIndex>=9){
      navigate("/endscreen",{state:{score:correctAnswers}});
    }
    setSongIndex(songIndex+1);
    setSelectedChoice(null);
  }
  useEffect(()=>{
    parseSongList();
  },[songs]);
  useEffect(() => {
    if (quizSong.length > 0 && remaingingSong.length > 0) {
        setSongChoices(ShuffleSongChoices());
    }
  }, [quizSong, remaingingSong, songIndex]);
  useEffect(()=>{
    if(quizSong.length!=0){
      console.log("preview",quizSong[songIndex].preview);
    }
  },[quizSong]);

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
        {(error!='') &&(
          <h1 style={{color:'white'}}>{error}</h1>
        )}
      </Box>
      <Box sx={{display:searchedArtist? 'none':'flex', flexDirection:'column'}}>

        
        <TextField id="outlined-basic" label="Artist" variant='standard' onChange={(e)=>{setArtist(e.target.value)}}
          sx={{
            '& .MuiInputBase-input': {
              color: 'white',
            },
            '& .MuiInputLabel-root': {
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
        <Button variant='contained' onClick={()=>{fetchSongs();}} 
          sx={{backgroundColor: '#4caf50',
            maxWidth:'100px',
            marginTop:'10px',
            alignSelf:'center',
            color: 'white',
            '&:hover': {
                backgroundColor: '#388e3c', // Darker green on hover
          },}}
        >Search</Button>
      </Box>
      {quizSong.length!=0 &&(
        <Box>
          <CustomAudioPlayer src={quizSong[songIndex].preview} />
        </Box>
      )}
      
      <Box alignItems="center" sx={{ width:'100vw'}}>
        {songs.length!=0 && quizSong.length!=0 && remaingingSong.length!=0 &&(
          <Box display="flex" justifyContent="center" alignItems="center"
            flexWrap='wrap'
            sx={{
              height:'50vh',
              overflowY:'auto',
              width:'100%',
            }}
          >
            {songChoices.map((song,index)=>(
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
                    height="180px"
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
                        alignItems:'center',
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
        
      </Box>
      <Button variant='contained'sx={{display: (selectedChoice!=null) ? 'block':'none'}} onClick={()=>{resetChoices()}}>Continue</Button>
    </Box>
  )
}

export default Game