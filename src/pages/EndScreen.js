import { Button , Box} from '@mui/material';
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function EndScreen() {
    const location = useLocation();
    const navigate = useNavigate();
    const {score} = location.state || {};
    return (
        <Box>
            <div>Score : {score}</div>
            <Button variant='contained' onClick={()=>{navigate('/')}}>Play again</Button>
        </Box>
    )
}

export default EndScreen