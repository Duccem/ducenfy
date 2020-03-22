<template>
    <div id="reproductor" class="row align-items-center">
        <audio id="player" @timeupdate="progressbar()" @ended="ended()">
            <source id="audioSource" :src="'http://localhost:3000/track/play/'+track.song" type="audio/mp3">
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
                <a href="#" class="mx-4"><i class="fas fa-random"></i></a>
                <a href="#" class="mx-4" @click="back()"><i class="fas fa-step-backward"></i></a>
                <a href="#" class="mx-4" @click="togglePlay(track._id)"  >
                    <i v-if="isPlaying" class="fas fa-pause" id="playIcon"></i>
                    <i v-else class="fas fa-play" id="playIcon"></i>
                </a>
                <a href="#" class="mx-4" @click="skip()"><i class="fas fa-step-forward" ></i></a>
                <a href="#" class="mx-4" @click="toggleRepeat($event)"><i class="fas fa-retweet"></i></a>
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
export default {
    name:'Reproductor',
    data:()=>{
        return {
            calculing:false,
            repeat:0,
            current:0,
            progressValue:0,
            player:null,
            volumeControl:null,
        }
    },
    mounted(){
        this.player = this.$el.querySelector('#player');
        this.volumeControl = this.$el.querySelector('#trackVolume');
        EventBus.$on('toggle-play',(item)=>{
            this.togglePlay(item);
        });
    },
    methods:{
        changeVolume(){
            this.setVolume(this.volumeControl.value / 100)
            this.player.volume = this.volume;
        },
        async togglePlay(id){
            if(id!=this.track._id){
                await this.loadSong(id);
                this.setIsPlaying(false);
            }
            if(this.isPlaying){
                EventBus.$emit('paused',this.isPlaying);
                this.setIsPlaying(false);
                this.player.pause();
            }else{
                EventBus.$emit('paused',this.isPlaying);
                this.setIsPlaying(true);
                this.player.play();           
            }
        },
        progressbar(){
            if(this.calculing) return;
            this.current = this.player.currentTime;
            this.progressValue = parseFloat((this.player.currentTime / this.track.duration));
        },
        async loadSong(track){
            return fetch('http://localhost:3000/track/'+track)
                .then(response => response.json())
                .then((data)=>{
                    this.setTrack(data.track);
                    this.player.load();
                })
                .catch(err=> console.log(err));
        },
        seek(event){
            this.calculing = true;
            let percent = event.offsetX / event.target.offsetWidth;
            this.player.currentTime = percent * this.track.duration;
            this.progressValue = parseFloat(percent / 100);
            this.calculing = false;
        },
        ended(){
            this.skip();
        },
        calculateCurrentValue(currentTime) {
            let current_minute = parseInt(currentTime / 60) % 60,
            current_seconds_long = currentTime % 60,
            current_seconds = current_seconds_long.toFixed(),
            current_time = (current_minute < 10 ? "" + current_minute : current_minute) + ":" + (current_seconds < 10 ? "0" + current_seconds : current_seconds);

            return current_time;
        },
        skip(){
            EventBus.$emit('skip',this.track._id);
        },
        back(){
            EventBus.$emit('back',this.track._id);
        },
        toggleRepeat(event){
            if(this.repeat == 0){
                event.target.classList.add('activo')
                this.repeat++;
            }else if(this.repeat == 1){
                event.target.innerText = '1';
                this.repeat++;
            }else{
                event.target.innerText = '';
                event.target.classList.remove('activo');
                this.repeat = 0;
            }
            EventBus.$emit('toggle-repeat',this.repeat);
        },
        setTrack(track){
            this.$store.dispatch('tracks/setCurrentTrack',track);
        },
        setIsPlaying(isPlaying){
            this.$store.dispatch('tracks/setIsPlaying',isPlaying);
        },
        setVolume(volume){
            this.$store.dispatch('tracks/setVolume',volume);
        }
    },
    computed:{
        track(){
            return this.$store.state.tracks.currentTrack;
        },
        isPlaying(){
            return this.$store.state.tracks.isPlaying;
        },
        volume(){
            return this.$store.state.tracks.volume;
        },
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
        }

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