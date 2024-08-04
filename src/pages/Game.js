import React, {useEffect, useState, useRef} from 'react'
import { AppBar, Toolbar, Typography, Button, Container, TextField, Box } from '@mui/material';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import ReactLoading from 'react-loading';
import { useNavigate } from 'react-router-dom';

function Game() {
  const [artist, setArtist]=useState('');
  const [songs,setSongs]=useState([]);
  const [quizSong,setQuizSong] = useState([]);
  const [remaingingSong, setRemainingSong]= useState([]);
  const [error, setError]=useState('');
  const [loading, setLoading] = useState(false);
  const [songIndex,setSongIndex]=useState(0);
  const [songChoices,setSongChoices]=useState([]);
  const [correctChoice, setCorrectChoice]= useState(null);
  const [selectedChoice, setSelectedChoice]= useState(null); 
  const [searchedArtist, setSearchedArtist] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [insufficientSongs, setInsufficientSongs] = useState(false);
  const audioRef = useRef(null);
  const navigate = useNavigate();
  const fetchArtist = async () =>{
    try{
        const artistResponse = await axios.get(`http://localhost:5000/search/artist?artist=${artist}`);
        const artistId = artistResponse.data.data[0]?.id;
        return artistId;
    }
    catch (error){
        console.log("error in fetch artist",error);
    }
  }
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
      try {
          // Fetch artist ID
          const artistId = await fetchArtist();

          if (!artistId) {
              setError('Artist not found');
              return;
          }

          // Fetch top 10 tracks for the artist
          const tracksResponse = await axios.get(`http://localhost:5000/artist/${artistId}/random`);
          if(tracksResponse.data.length<15){
            // setError("Less than 15 songs");
            setInsufficientSongs(true);
            console.log("less than 15songs");
            setSearchedArtist(false);
            setLoading(false);
            return;
          }
          setSongs(tracksResponse.data);
          setError('');
          setInsufficientSongs(false);
      } catch (error) {
          console.error("Error fetching songs:", error);
          setError('Error fetching songs');
      }
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
      <Container style={{ textAlign: 'center', backgroundColor:"white", marginTop:"10%", padding:"20px", backgroundColor:"#161616"}}>
        <div style={{ display: loading ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <ReactLoading type="bars" color="orange" height={80} width={80} />
        </div>
        <Box sx={{display:searchedArtist? 'none':'flex', justifyContent:"center", alignItems:"center"}}>
          <TextField id="outlined-basic" label="Artist" variant='filled' sx={{backgroundColor:"white",'& .MuiInputLabel-root.Mui-focused': 
          {color: 'gray',fontSize:"20px"}}} onChange={(e)=>{setArtist(e.target.value)}}/>
          <Button variant='contained' sx={{backgroundColor: '#4caf50',color: 'white','&:hover': {backgroundColor: '#388e3c',},marginLeft:"10px"}} onClick={()=>{fetchSongs();}}>Search</Button>
        </Box>
        <Box sx={{display:insufficientSongs ? 'block' :'none'}}>
          <h1>Sorry the following artist you have searched has less than 15 songs to be used for the game. Please try again with a new artist.</h1>
        </Box>
        {quizSong.length!=0 &&(
          <Box>
            <audio controls key={quizSong[songIndex].preview}>
              <source src={quizSong[songIndex].preview} type="audio/mpeg"/>
              
            </audio>
            <h1>{quizSong[songIndex]["title"]}</h1>
          </Box>
        )}
        
        <Box width="80%" backgroundColor="black" alignItems="center">
          {songs.length!=0 && quizSong.length!=0 && remaingingSong.length!=0 &&(
            <Box display="flex" width="80%" alignItems="center">
              {songChoices.map((song,index)=>(
                <Card 
                  key={index} 
                  sx={{ 
                    maxWidth: 345 , 
                    border: (selectedChoice===index) ? correctChoice ? 'green 2px solid' : 'red 2px solid' : 'none',
                    
                  }}>
                  <CardActionArea onClick={(e)=>{
                    checkSongChoice(song["title"],index);
                  }}>
                    <CardMedia 
                      component="img"
                      height="200"
                      image={song["album"]["cover_big"]}
                    />
                    <CardContent sx={{backgroundColor:'#020202',color:'white'}}>
                      <Typography gutterBottom variant="h5" component="div" >
                        {song["title"]}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
            </Box>
          )}    
          <Button variant='contained'sx={{display: (selectedChoice!=null) ? 'block':'none', backgroundColor: '#4caf50',color: 'white','&:hover': {backgroundColor: '#388e3c',},}} onClick={()=>{resetChoices()}}>Continue</Button>
        </Box>
      </Container>
  )
}

export default Game