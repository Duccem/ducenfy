const state = {
    tracks:[],
    listTracks:[],
    currentTrack:{
        _id:'',
        title:'Unknow',
        duration:0,
        photo:'http://localhost:3000/images/default-song-image.jpg',
        song:'',
        album:'Unknow',
        artist:'Unknow'
    },
    randomRestTracks:[],
    randomPastTracks:[],
    isPlaying:false,
    isRandom:false,
    repeat:0,
    volume: 80,
};

const getters = {

};

const mutations = {
    SET_CURRENT_TRACK(state,track){
        state.currentTrack = track;
    },
    SET_IS_PLAYING(state,track){
        state.isPlaying = track;
    },
    SET_VOLUME(state,volume){
        state.volume = volume;
    }
};

const actions = {
    setCurrentTrack({commit},track){
        commit('SET_CURRENT_TRACK',track);
    },
    setIsPlaying({commit},isPlaying){
        commit('SET_IS_PLAYING',isPlaying);
    },
    setVolume({commit},volume){
        commit('SET_VOLUME',volume);
    }
};

export default {
    namespaced:true,
    state,
    getters,
    mutations,
    actions
}