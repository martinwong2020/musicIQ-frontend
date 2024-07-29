import React, {useEffect, useState} from 'react'

import { AppBar, Toolbar, Typography, Button, Container, TextField, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// import { fetchSongs } from '../services/Deezer';
function Home() {
    const navigate = useNavigate();
    // const [artist, setArtist] = useState('');
    // const [songs, setSongs] = useState([]);
    // const [error, setError] = useState('');
    // const fetchArtist = async () =>{
    //     try{
    //         const artistResponse = await axios.get(`http://localhost:5000/search/artist?artist=${artist}`);
    //         const artistId = artistResponse.data.data[0]?.id;
    //         return artistId;
    //         console.log("artist id",artistId);
    //     }
    //     catch (error){
    //         console.log("error in fetch artist",error);
    //     }
    // }
    // const fetchSongs = async () => {
    //     try {
    //         // Fetch artist ID
    //         const artistId = await fetchArtist();

    //         if (!artistId) {
    //             setError('Artist not found');
    //             return;
    //         }

    //         // Fetch top 10 tracks for the artist
    //         const tracksResponse = await axios.get(`http://localhost:5000/artist/${artistId}/random`);
    //         setSongs(tracksResponse.data);
    //         setError('');
    //     } catch (error) {
    //         console.error("Error fetching songs:", error);
    //         setError('Error fetching songs');
    //     }
    // };
    
    return (
        <div>
        <AppBar position="static">
            <Toolbar>
            <Typography variant="h6">Music Nerd Clone</Typography>
            </Toolbar>
        </AppBar>
        <Container style={{ textAlign: 'center', marginTop: '50px' }}>
            <Typography variant="h4" gutterBottom>Welcome to Music Nerd!</Typography>

            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={2}>
                    <Button variant='contained' onClick={()=>{navigate("/game")}}>Single Player</Button>
                    <Button variant='contained'>Create Room</Button>
                    <Button variant='contained'>Join Room</Button>
            </Box>
            
            {/* <TextField id="outlined-basic" label="Artist" variant="outlined" onChange={(e)=>{setArtist(e.target.value)}}/>
            <Button variant="contained" color="primary" onClick={(e)=>{fetchSongs()}} >Start Game</Button>
            <ul>
                {songs.map((song) => (
                    <li key={song.id}>
                        <p>{song.title} by {song.artist.name}</p>
                        <audio controls>
                            <source src={song.preview} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                    </li>
                ))}
            </ul> */}
        </Container>
        </div>
    );
}

export default Home;