import { Button , Box} from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function EndScreen() {
    const location = useLocation();
    const navigate = useNavigate();
    const {score} = location.state || {};
    const {multiscore} = location.state || {};
    const [playersScore, setPlayersScore] = useState([])
    // {
    //     "playerAnswers": {
    //         "RxcY04QmMqFG7Q2LAAAL": [
    //             false,
    //             true,
    //             true,
    //             true,
    //             false,
    //             false,
    //             true,
    //             true,
    //             false,
    //             true
    //         ],
    //         "1xLdyxRQR32cOP1WAAAN": [
    //             false,
    //             false,
    //             false,
    //             false,
    //             true,
    //             true,
    //             false,
    //             false,
    //             false,
    //             false
    //         ]
    //     },
    //     "players": {
    //         "RxcY04QmMqFG7Q2LAAAL": "a",
    //         "1xLdyxRQR32cOP1WAAAN": "b"
    //     }
    // }
    const calculateScore = () =>{
        if(Object.keys(multiscore).length==0){
            return;
        }
        const players ={};
        for(const [id,username] of Object.entries(multiscore["players"])){
            const responses = multiscore["playerAnswers"][id];
            const score = responses.filter(answer => answer === true).length;
            players[username]=score;
        }
        const sortedScoresArray = Object.entries(players).sort(([, scoreA], [, scoreB]) => scoreB - scoreA);
        // players.sort((a,b)=>a[username]-b[username]);
        console.log("sorted",sortedScoresArray);
        setPlayersScore(sortedScoresArray);
    }
    useEffect(()=>{
        console.log("this is multi score",multiscore);
        calculateScore();
    },[multiscore])
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
            {/* <div>Score : {score}</div> */}
            {Object.keys(multiscore).length!=0 &&(
                <Box>
                    <ol>
                        {playersScore.length !== 0 && playersScore.map((score, index) => (
                            <li 
                                key={index} 
                                style={{
                                    color:index===0?'#d5a500' :index ===1?'#b7b7b7' : index ===2?'#a17419':'white', 
                                    fontFamily:'Oswald', 
                                    fontOpticalSizing:'auto', 
                                    fontWeight:'530', 
                                    fontSize:'1.5em'
                                }}
                            >
                                {score[0]}: {score[1]}
                            </li>
                        ))}
                    </ol>
                </Box>
            )}
            <Button variant='contained' onClick={()=>{navigate('/')}}>Play again</Button>
        </Box>
        
    )
}

export default EndScreen