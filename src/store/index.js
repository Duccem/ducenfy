import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state:{
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
        repeat:0
    },  
    getters:{

    },
    mutations:{

    },
    actions:{
    
    }
  })
