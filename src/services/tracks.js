import axios from 'axios';

async function listTrack(){
    try {
        let { data }  = await axios.get('http://localhost:3000/track');
        let { tracks } = data;
        return tracks;
    } catch (error) {
        console.log(error);
        return [];
    }
}

async function getTrack(id){
    try {
        let { data } = await axios.get(`http://localhost:3000/track/${id}`);
        let { track } = data;
        return track;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export default { listTrack, getTrack }