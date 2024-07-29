import React, {useEffect, useState} from 'react'
import { AppBar, Toolbar, Typography, Button, Container, TextField, Box } from '@mui/material';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';

function Game() {
  const [artist, setArtist]=useState('');
  const [songs,setSongs]=useState([]);
  const [quizSong,setQuizSong] = useState([]);
  const [remaingingSong, setRemainingSong]= useState([]);
  const [error, setError]=useState('');
  const [loading, setLoading] = useState(true);
  const [songIndex,setSongIndex]=useState(0);
  const [songChoices,setSongChoices]=useState([]);
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
    setQuizSong(songs.slice(0,10));
    setRemainingSong(songs.slice(10));
    
  }
  const fetchSongs = async () => {
      try {
          // Fetch artist ID
          const artistId = await fetchArtist();

          if (!artistId) {
              setError('Artist not found');
              return;
          }

          // Fetch top 10 tracks for the artist
          const tracksResponse = await axios.get(`http://localhost:5000/artist/${artistId}/random`);
          setSongs(tracksResponse.data);
          // console.log(tracksResponse.data);
          // parseSongList();
          setError('');
      } catch (error) {
          console.error("Error fetching songs:", error);
          setError('Error fetching songs');
      }
  };
  const ShuffleSongChoices = ()=>{
    let array = [quizSong[songIndex],remaingingSong[songIndex],remaingingSong[songIndex+1]];
    return array.sort(() => Math.random() - 0.5);
  }
  const checkSongChoice = (value) =>{
    return value === quizSong[songIndex]["title"];
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
    console.log("song choices",songChoices);
  },[songChoices]);
  return (
    <Container style={{ textAlign: 'center', marginTop: '50px' }}>
      <TextField id="outlined-basic" label="Artist" variant='outlined' onChange={(e)=>{setArtist(e.target.value)}}/>
      <Button variant='contained' onClick={()=>{fetchSongs();}}>Search</Button>
      {quizSong.length!=0 &&(
        <Box>
          <audio controls>
            <source src={quizSong[songIndex].preview} type="audio/mpeg"/>
            
          </audio>
          <h1>{quizSong[songIndex]["title"]}</h1>
        </Box>
      )}
      
      <Box width="80%" backgroundColor="black" alignItems="center">
        {songs.length!=0 && quizSong.length!=0 && remaingingSong.length!=0 &&(
          <Box display="flex" width="80%" alignItems="center">
            {songChoices.map((song)=>(
              <Card sx={{ maxWidth: 345 }}>
                <CardActionArea onClick={(e)=>{
                  checkSongChoice(song["title"]);
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
      </Box>
    </Container>
  )
}

export default Game