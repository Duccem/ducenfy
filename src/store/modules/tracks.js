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
    },
    SET_TRACKS(state,tracks){
        state.tracks = tracks;
    },
    SET_REPEAT(state,repeat){
        state.repeat = repeat;
    }
};

const actions = {
    setTrack({commit, state},id){
        let track = state.tracks.find(track => track._id == id);
        commit('SET_CURRENT_TRACK',track);
    },
    setIsPlaying({commit},isPlaying){
        commit('SET_IS_PLAYING',isPlaying);
    },
    setVolume({commit},volume){
        commit('SET_VOLUME',volume);
    },
    setTracks({commit},tracks){
        commit('SET_TRACKS',tracks);
    },
    setRepeat({commit},repeat){
        commit('SET_REPEAT',repeat);
    },
    skip({commit, state}){
        let index = state.tracks.findIndex(track => state.currentTrack._id == track._id);
        if(state.repeat == 2) return;
        if(index == state.tracks.length - 1){
            if(state.repeat == 1){
                index = 0;
            }
        }else{
            index++;
        }
        commit('SET_CURRENT_TRACK',state.tracks[index]);
    },
    back({commit, state}){
        let index = state.tracks.findIndex(track => state.currentTrack._id == track._id);
        if(state.repeat == 2) return;
        if(index == 0){
            if(state.repeat == 1){
                index = state.tracks.length - 1;
            }
        }else{
            index--;
        }
        commit('SET_CURRENT_TRACK',state.tracks[index]);
    }

};

export default {
    namespaced:true,
    state,
    getters,
    mutations,
    actions
}