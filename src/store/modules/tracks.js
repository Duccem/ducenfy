const state = {
    tracks:[],
    listTracks:[],
    currentTrack:{
        _id:'',
        title:'Unknow',
        duration:0,
        photo:'/images/default-song-image.jpg',
        song:'',
        album:'Unknow',
        artist:'Unknow'
    },
    randomTracks:[],
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
    },
    SET_IS_RANDOM(state,isRandom){
        state.isRandom = isRandom;
    },
    SET_RANDOM_TRACKS(state,randomTracks){
        state.randomTracks = randomTracks;
    }
};

const actions = {
    setTrack({commit, state},id){
        let track;
        if(state.isRandom){
            track = state.randomTracks.find(track => track._id == id);
        }else{
            track = state.tracks.find(track => track._id == id);
        }
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
        let index = 0;
        let tracks;
        if(state.isRandom){
            index = state.randomTracks.findIndex(track => state.currentTrack._id == track._id);
            tracks = state.randomTracks;
        }else{
            index = state.tracks.findIndex(track => state.currentTrack._id == track._id);
            tracks = state.tracks;
        }
        if(state.repeat == 2) return;
        if(index == tracks.length - 1){
            if(state.repeat == 1){
                index = 0;
            }
        }else{
            index++;
        }
        commit('SET_CURRENT_TRACK',tracks[index]);
    },
    back({commit, state}){
        let index = 0;
        let tracks;
        if(state.isRandom){
            index = state.randomTracks.findIndex(track => state.currentTrack._id == track._id);
            tracks = state.randomTracks;
        }else{
            index = state.tracks.findIndex(track => state.currentTrack._id == track._id);
            tracks = state.tracks;
        }
        if(state.repeat == 2) return;
        if(index == 0){
            if(state.repeat == 1){
                index = tracks.length - 1;
            }
        }else{
            index--;
        }
        commit('SET_CURRENT_TRACK',tracks[index]);
    },
    setRandom({commit, state},isRandom){
        if(isRandom){
            let newTrackArray = state.tracks.map(track => track);
            newTrackArray.sort(()=> Math.random() - 0.5);
            let index = newTrackArray.findIndex(track => state.currentTrack._id == track._id);
            if(index != -1){
              let track =  newTrackArray.splice(index,1);
              newTrackArray.splice(0,0,track[0]);
            }
            commit('SET_RANDOM_TRACKS',newTrackArray);
        }
        commit('SET_IS_RANDOM',isRandom);
    }

};

export default {
    namespaced:true,
    state,
    getters,
    mutations,
    actions
}