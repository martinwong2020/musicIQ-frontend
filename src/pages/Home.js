import React, {useEffect, useState} from 'react'

import { AppBar, Toolbar, Typography, Button, Container, TextField, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/style.css'
// import { fetchSongs } from '../services/Deezer';
function Home() {
    const navigate = useNavigate();
    return (
        <div style={{backgroundColor:'#161616', height:'100vh', width:'100vw', margin:0, display:'flex', justifyContent:'center', alignItems:'center'}}>
        {/* <AppBar position="static">
            <Toolbar>
            <Typography variant="h6">Music Nerd Clone</Typography>
            </Toolbar>
        </AppBar> */}
            <Container style={{ textAlign: 'center'}}>
                <Typography variant="h4" gutterBottom sx={{color:'#e6e6e6', fontFamily:'Oswald', fontOpticalSizing:'auto', fontWeight:'530', fontSize:'3.5em'}}>Welcome to Music<span style={{color:"#b3eeb3"}}>IQ</span></Typography>

                <Box
                    display="flex"
                    // flexDirection="column"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent='center'
                    flexWrap='wrap'
                    gap={2}>
                        <Button variant='contained' onClick={()=>{navigate("/game")}} 
                            sx={{backgroundColor: '#4caf50',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#388e3c', // Darker green on hover
                            },}}
                        >Single Player</Button>
                        <Button variant='contained'
                            sx={{backgroundColor: '#4caf50',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#388e3c', // Darker green on hover
                                },}}
                        >Create Room</Button>
                        <Button variant='contained'
                            sx={{backgroundColor: '#4caf50',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#388e3c', // Darker green on hover
                                },}}
                        >Join Room</Button>
                </Box>
            </Container>
        </div>
    );
}

export default Home;