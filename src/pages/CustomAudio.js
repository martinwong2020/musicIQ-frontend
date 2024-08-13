import React, { useRef, useState, useEffect } from 'react';
import vinyl from '../images/vinyl-128.png';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
import '../css/audio.css';
function CustomAudioPlayer({ src }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [volume, setVolume] = useState(0.5);
  useEffect(() => {
    let animationFrameId;

    if (isPlaying) {
      const startTime = performance.now();

      const animate = (time) => {
        const elapsed = time - startTime;
        const newRotation = (rotation + (elapsed / 1000) * 360) % 360;
        setRotation(newRotation);
        animationFrameId = requestAnimationFrame(animate);
      };

      animationFrameId = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, rotation]);
  useEffect(()=>{
    if(audioRef.current){
      setIsPlaying(0);
    }
  },[src]);
  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolume = (e) =>{
    const newVolume = e.target.value;
    setVolume(newVolume);
    audioRef.current.volume=newVolume;
  }
  return (
    <div style={styles.playerContainer}>
      <img src={vinyl} onClick ={handlePlayPause} className='rotateVinyl' style={{ transform: `rotate(${rotation}deg)` }} alt="vinyl"/>
      <audio ref={audioRef} src={src} />
      <div style={styles.recordHolder}>
        <VolumeMuteIcon style={{height:'50px',width:'40px',marginLeft:'100px'}}/>
        <input type="range" min="0" max= "1" step="0.01" value={volume} onChange={(e)=>{handleVolume(e)}} className='volumeInput' />
      </div>
    </div>
  );
}

const styles = {
  playerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '280px',
    height:'130px',
    borderRadius: '10px',
    padding: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    position: 'relative',
    marginBottom:'30px',
  },
  recordHolder: {
    width:'280px',
    height:'50px',
    backgroundColor:'#b99976',
    padding:'10px',
    position: 'absolute',
    bottom: '0',
    display: 'flex',
    justifyContent: 'flex-end',
    borderRadius: '3px'
  }
};

export default CustomAudioPlayer;
