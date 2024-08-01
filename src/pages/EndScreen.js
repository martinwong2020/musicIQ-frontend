import React from 'react'
import { useLocation } from 'react-router-dom'

function EndScreen() {
    const location = useLocation();
    const {score} = location.state || {};
    return (
        <div>Score : {score}</div>
    )
}

export default EndScreen