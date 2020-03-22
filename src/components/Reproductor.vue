<template>
    <div id="reproductor" class="row align-items-center">
        <audio id="player" @timeupdate="progressbar()" @ended="ended()">
            <source id="audioSource" :src="song.source" type="audio/mp3">
        </audio>
        <div class="col-md-3">
            <div class="row">
                <img class="" :src="song.photo" alt="" id="miniatura">
                <div class="col-md-6 ml-2 mt-2">
                    <h6 id="cancion">{{ song.title }}</h6>
                    <h6 id="artista">{{ song.artist }}</h6>
                </div>
            </div>
        </div>
        <div class="col md-6">
            <div class="row justify-content-center ">
                <a href="#" class="mx-4"><i class="fas fa-random"></i></a>
                <a href="#" class="mx-4" @click="back()"><i class="fas fa-step-backward"></i></a>
                <a href="#" class="mx-4" @click="togglePlay(song._id)"  ><i class="fas fa-play" id="playIcon"></i></a>
                <a href="#" class="mx-4" @click="skip()"><i class="fas fa-step-forward" ></i></a>
                <a href="#" class="mx-4" @click="toggleRepeat($event)"><i class="fas fa-retweet"></i></a>
            </div>
            <div class="row justify-content-center align-items-center">
                <a href="#" id="start-time" >0:00</a>
                <input type="range" @click="seek($event)" min="0.000" max="1.000" step="0.001" class="slider ml-4 mr-4" id="trackProgress">
                <a href="#" id="end-time">0:00</a>
            </div>
        </div>
        <div class="col-md-3 row align-items-center justify-content-center">
          <a href="#"><i class="fas fa-volume-up" id="volumeIcon"></i></a>
          <input type="range" name="" min="0" max="100" class="ml-2 slider" @change="changeVolume()" value="100" id="trackVolume">
        </div>
    </div>
</template>

<script>
import EventBus from '../bus'
export default {
    name:'Reproductor',
    data:()=>{
        return {
            playit:false,
            calculing:false,
            repeat:0,
            song:{
                _id:'',
                source:'',
                duration:0,
                photo:'http://localhost:3000/images/default-song-image.jpg',
                artist:'Ninguno',
                album:'',
                title:'Ninguna'
            }
        }
    },
    mounted(){
        EventBus.$on('toggle-play',(item)=>{
            this.togglePlay(item);
        });
    },
    methods:{
        changeVolume(){
            let player = this.$el.querySelector('#player');
            let volumeRange = this.$el.querySelector('#volumeIcon');
            let { value } = this.$el.querySelector('#trackVolume');
            volumeRange.classList.remove(volumeRange.classList[1]);
            if(value == 0){
                volumeRange.classList.add('fa-volume-mute');
            }else if(value < 50){
                volumeRange.classList.add('fa-volume-down');
            }else{
                volumeRange.classList.add('fa-volume-up');
            }
            player.volume = value / 100;
        },
        async togglePlay(id){
            let playIcon = this.$el.querySelector('#playIcon');
            let player = this.$el.querySelector('#player');
            playIcon.classList.remove(playIcon.classList[1]);
            if(id!=this.song._id){
                await this.loadSong(id);
                this.playit = false;
                this.song._id = id;
            }
            if(this.playit){
                playIcon.classList.add('fa-play');
                EventBus.$emit('paused',this.playit);
                this.playit = false;
                player.pause();
            }else{
                playIcon.classList.add('fa-pause');
                EventBus.$emit('paused',this.playit);
                this.playit = true;
                player.play();           
            }
        },
        progressbar(){
            if(this.calculing) return;
            let player = this.$el.querySelector('#player');
            let progress = this.$el.querySelector('#trackProgress');
            progress.value = parseFloat((player.currentTime / this.song.duration));
            let currentTime = this.calculateCurrentValue(player.currentTime);
            this.$el.querySelector("#start-time").innerHTML = currentTime;
        },
        async loadSong(track){
            let player = this.$el.querySelector('#player');
            return fetch('http://localhost:3000/track/'+track)
                .then(response => response.json())
                .then((data)=>{
                    this.song.duration = data.track.duration;
                    this.song.source = 'http://localhost:3000/track/play/'+data.track.song;
                    this.song.photo =data.track.photo;
                    this.song.artist = data.track.artist;
                    this.song.title = data.track.title;
                    this.song.album = data.track.album;
                    player.load();
                    let totalLength = this.calculateTotalValue(this.song.duration);
                    this.$el.querySelector("#end-time").innerHTML = totalLength;
                })
                .catch(err=> console.log(err));
        },
        seek(event){
            this.calculing = true;
            let player = this.$el.querySelector('#player');
            let progress = this.$el.querySelector('#trackProgress');
            let percent = event.offsetX / event.target.offsetWidth;
            player.currentTime = percent * this.song.duration;
            progress.value = parseFloat(percent / 100);
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
        calculateTotalValue(length) {
            var minutes = Math.floor(length / 60),
            seconds_int = length - minutes * 60,
            seconds_str = seconds_int.toString(),
            seconds = seconds_str.substr(0, 2),
            time = minutes + ':' + (seconds < 10 ? "0" + seconds : seconds);

            return time;
        },
        skip(){
            EventBus.$emit('skip',this.song._id);
        },
        back(){
            EventBus.$emit('back',this.song._id);
        },
        toggleRepeat(event){
            if(this.repeat == 0){
                event.target.classList.add('activo')
                this.repeat++;
            }else if(this.repeat == 1){
                event.target.innerText = '1';
                this.repeat++;
            }else{
                console.log(event.target.innerText);
                event.target.innerText = '';
                event.target.classList.remove('activo');
                this.repeat = 0;
            }
            EventBus.$emit('toggle-repeat',this.repeat);
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