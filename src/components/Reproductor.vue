<template>
    <div id="reproductor" class="row align-items-center">
        <audio id="player" @timeupdate="progressbar()" @ended="forWard()" >
            <source id="audioSource" :src="'http://localhost:3000/track/play/'+track.song"  type="audio/mp3">
        </audio>
        <div class="col-md-3">
            <div class="row">
                <img class="" :src="track.photo" alt="" id="miniatura">
                <div class="col-md-6 ml-2 mt-2">
                    <h6 id="cancion">{{ track.title }}</h6>
                    <h6 id="artista">{{ track.artist }}</h6>
                </div>
            </div>
        </div>
        <div class="col md-6">
            <div class="row justify-content-center ">
                <a href="#" class="mx-4" @click="setRandom(!isRandom)">
                    <i v-if="!isRandom" class="fas fa-random"></i>
                    <i v-else class="fas fa-random activo"></i>
                </a>
                <a href="#" class="mx-4" @click="backWard()"><i class="fas fa-step-backward"></i></a>
                <a href="#" class="mx-4" @click="togglePlay(track._id)"  >
                    <i v-if="isPlaying" class="fas fa-pause" id="playIcon"></i>
                    <i v-else class="fas fa-play" id="playIcon"></i>
                </a>
                <a href="#" class="mx-4" @click="forWard()"><i class="fas fa-step-forward" ></i></a>
                <a v-if="repeat==0" href="#" class="mx-4" @click="setRepeat(1)"><i class="fas fa-long-arrow-alt-right"></i></a>
                <a v-else-if="repeat==1" href="#" class="mx-4" @click="setRepeat(2)"><i class="fas fa-retweet"></i></a>
                <a v-else href="#" class="mx-4" @click="setRepeat(0)"><i class="fas fa-retweet activo"></i></a>
            </div>
            <div class="row justify-content-center align-items-center">
                <a href="#" id="start-time" >{{ currentTime }}</a>
                <input type="range" @click="seek($event)" min="0.000" :value="progressValue" max="1.000" step="0.001" class="slider ml-4 mr-4" id="trackProgress">
                <a href="#" id="end-time">{{ totalDuration }}</a>
            </div>
        </div>
        <div class="col-md-3 row align-items-center justify-content-center">
            <a href="#">
                <i v-if="volume < 0.5" class="fas fa-volume-down" id="volumeIcon"></i>
                <i v-else-if="volume == 0" class="fas fa-volume-mute" id="volumeIcon"></i>
                <i v-else class="fas fa-volume-up" id="volumeIcon"></i>
            </a>
            <input type="range" name="" min="0" max="100" class="ml-2 slider" @change="changeVolume()" value="80" id="trackVolume">
        </div>
    </div>
</template>

<script>
import EventBus from '../bus'
import { mapState, mapActions } from 'vuex';
export default {
    name:'Reproductor',
    data:()=>{
        return {
            calculing:false,
            current:0,
            progressValue:0,
            player:null,
            volumeControl:null,
        }
    },
    mounted(){
        this.player = this.$el.querySelector('#player');
        this.volumeControl = this.$el.querySelector('#trackVolume');
        EventBus.$on('load-song',(item)=> this.loadSong(item));
        EventBus.$on('toggle-play',()=> this.togglePlay());
    },
    methods:{
        changeVolume(){
            this.setVolume(this.volumeControl.value / 100)
            this.player.volume = this.volume;
        },
        togglePlay(){
            if(this.isPlaying){
                this.setIsPlaying(false);
                this.player.pause();
            }else{
                this.setIsPlaying(true);
                this.player.play();           
            }
        },
        progressbar(){
            if(this.calculing) return;
            this.current = this.player.currentTime;
            this.progressValue = parseFloat((this.player.currentTime / this.track.duration));
        },
        loadSong(track){
            this.setTrack(track);
            this.setIsPlaying(false);
            this.player.load();
        },
        seek(event){
            this.calculing = true;
            let percent = event.offsetX / event.target.offsetWidth;
            this.player.currentTime = percent * this.track.duration;
            this.progressValue = parseFloat(percent / 100);
            this.calculing = false;
        },
        forWard(){
            this.skip();
            this.player.load();
            this.togglePlay();
            this.togglePlay();
        },
        backWard(){
            this.back();
            this.player.load();
            this.togglePlay();
            this.togglePlay();
        },
        ...mapActions('tracks',['setTrack','setIsPlaying','setVolume','setRepeat','skip','back','setRandom'])
    },
    computed:{
        totalDuration() {
            let length = this.track.duration;
            var minutes = Math.floor(length / 60),
            seconds_int = length - minutes * 60,
            seconds_str = seconds_int.toString(),
            seconds = seconds_str.substr(0, 2),
            time = minutes + ':' + (seconds < 10 ? "0" + seconds : seconds);

            return time;
        },
        currentTime(){
            let currentTime = this.current;
            let current_minute = parseInt(currentTime / 60) % 60,
            current_seconds_long = currentTime % 60,
            current_seconds = current_seconds_long.toFixed(),
            current_time = (current_minute < 10 ? "" + current_minute : current_minute) + ":" + (current_seconds < 10 ? "0" + current_seconds : current_seconds);

            return current_time;
        },
        ...mapState('tracks',{
            track:'currentTrack',
            isPlaying: 'isPlaying',
            volume: 'volume',
            repeat: 'repeat',
            isRandom: 'isRandom'
        })

    }
}
</script>

<style scoped>

a{
    color:white;
}
a:hover{
    text-decoration: none;
}

#miniatura{
    max-height: 100px;
}
#trackProgress{
    min-width: 300px;
}
.slider {
  -webkit-appearance: none;  /* Override default CSS styles */
  appearance: none;
  height: 3px; /* Specified height */
  background: #d3d3d3; /* Grey background */
  outline: none; /* Remove outline */
  opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
  -webkit-transition: .2s; /* 0.2 seconds transition on hover */
  transition: opacity .2s;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 10px;
  height: 10px;
  border-radius: 50%; 
  background: #2ebd59;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #2ebd59;
  cursor: pointer;
}
 
</style>