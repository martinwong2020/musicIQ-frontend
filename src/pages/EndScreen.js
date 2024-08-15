import { Button , Box} from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import GenerateAvatar from './GenerateAvatar';

function EndScreen() {
    const location = useLocation();
    const navigate = useNavigate();
    const {score} = location.state || {};
    const {multiscore} = location.state || {};
    const [playersScore, setPlayersScore] = useState([])
    const calculateScore = () =>{
        if (!multiscore || Object.keys(multiscore).length === 0) {
            return;
        }
        const players ={};
        for (const [id, username] of Object.entries(multiscore.players || {})) {
            const responses = multiscore.playerAnswers?.[id] || [];
            const score = responses.filter(answer => answer === true).length;
            players[username]=score;
        }
        const sortedScoresArray = Object.entries(players).sort(([, scoreA], [, scoreB]) => scoreB - scoreA);
        console.log("sorted",sortedScoresArray);
        setPlayersScore(sortedScoresArray);
    }
    useEffect(()=>{
        console.log("this is multi score",multiscore);
        calculateScore();
    },[multiscore]);
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
            alignItems: 'center'}}
        >   
            {score &&(
                <Box>
                    <h1 style={{color:'white'}}>Score :{score}</h1>
                </Box>
            )}
            {multiscore && Object.keys(multiscore).length !== 0 && (
                <Box>
                    <ol >
                        {playersScore.length !== 0 && playersScore.map((score, index) => (
                            <li 
                                key={index} 
                                style={{
                                    color:index===0?'#d5a500' :index ===1?'#b7b7b7' : index ===2?'#a17419':'white', 
                                    fontFamily:'Oswald', 
                                    fontOpticalSizing:'auto', 
                                    fontWeight:'530', 
                                    fontSize:'1.5em',
                                    textAlign:'center',
                                }}
                            >
                                <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                                    <GenerateAvatar username={score[0]} />
                                    {score[0]}: {score[1]}
                                </div>
                            </li>
                        ))}
                    </ol>
                </Box>
            )}
            <Button variant='contained' onClick={()=>{navigate('/');sessionStorage.clear();}}>Play again</Button>
        </Box>
        
    )
}

export default EndScreen