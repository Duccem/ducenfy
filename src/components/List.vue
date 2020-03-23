<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="List col-md-12">
                <h2 class="my-3">Ducenfy</h2>
                <div class="tabla">
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col"></th>
                                <th scope="col">Title</th>
                                <th scope="col">Artist</th>
                                <th scope="col">Album</th>
                                <th scope="col">Duracion</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="track in tracks" :key="track._id" :id="track._id">
                                <td >
                                    <a href="#" @click="selectTrack(track._id)">
                                        <i v-if="track._id != currentTrack._id"  class="fas fa-play" id="playIcon"></i>
                                        <i v-else-if="!isPlaying"  class="fas fa-play activo" id="playIcon"></i>
                                        <i v-else  class="fas fa-pause activo" id="playIcon"></i>
                                    </a>
                                </td>
                                <td >{{ track.title }}</td>
                                <td >{{ track.artist }}</td>
                                <td >{{ track.album }}</td>
                                <td >{{ track.duration | formatTime }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    
</template>

<script>
import EventBus from '../bus'
import { mapState, mapActions } from 'vuex';
import service from  '../services';
export default {
    name:'List',
    filters:{
        formatTime(str){
            let length = parseFloat(str);
            var minutes = Math.floor(length / 60),
            seconds_int = length - minutes * 60,
            seconds_str = seconds_int.toString(),
            seconds = seconds_str.substr(0, 2),
            time = minutes + ':' + (seconds < 10 ? "0" + seconds : seconds);

            return time;
        }
    },
    computed:mapState('tracks',['tracks','listTracks','currentTrack','isPlaying', 'repeat']),
    async mounted(){
        let tracks = await service.tracks.listTrack();
        this.setTracks(tracks);
    },
    methods:{
        ...mapActions('tracks',['setTracks']),
        selectTrack(id){
            if(id!=this.currentTrack._id){
                EventBus.$emit('load-song',id);   
            }
            EventBus.$emit('toggle-play');
        }
    }
}
</script>

<style>
a{
    color:white;
}
a:hover{
    color:white;
    text-decoration: none;
}
.container{
    width: 100%;
    height: 500px;

    margin-bottom: 0;
    color:white;
}
    .List{
        text-align: center;
        background: #2c2d2f;
    }
    .table{
        color:white;
    }
    .tabla{
        
        max-height: 440px;
        overflow-y: scroll;
    }
    .activo{
        color:#2ebd59 !important;
    }
</style>