import axios from 'axios';
const backendURL= process.env.REACT_APP_BACKEND_URL
export const fetchArtist = async (artist) =>{
    try{
        const artistResponse = await axios.get(`${backendURL}/search/artist?artist=${artist}`);
        const artistId = artistResponse.data.data[0]?.id;
        return artistId;
    }
    catch (error){
        console.log("error in fetch artist",error);
    }
  }