import { Button , Box} from '@mui/material';
import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function EndScreen() {
    const location = useLocation();
    const navigate = useNavigate();
    const {score} = location.state || {};
    const {multiscore} = location.state || {};
    useEffect(()=>{
        console.log("this is multi score",multiscore);
    },[multiscore])
    return (
        <Box>
            <div>Score : {score}</div>
            <Button variant='contained' onClick={()=>{navigate('/')}}>Play again</Button>
        </Box>
        
    )
}

export default EndScreen