import axios from 'axios';
export const fetchArtist = async (artist) =>{
    try{
        const artistResponse = await axios.get(`http://localhost:5000/search/artist?artist=${artist}`);
        const artistId = artistResponse.data.data[0]?.id;
        return artistId;
    }
    catch (error){
        console.log("error in fetch artist",error);
    }
  }