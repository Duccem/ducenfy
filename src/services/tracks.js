import axios from 'axios';

async function listTrack(){
    try {
        let { data }  = await axios.get('/track');
        let { tracks } = data;
        return tracks;
    } catch (error) {
        return [];
    }
}

async function getTrack(id){
    try {
        let { data } = await axios.get(`/track/${id}`);
        let { track } = data;
        return track;
    } catch (error) {
        return null;
    }
}

export default { listTrack, getTrack }