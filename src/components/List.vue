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
                                <td ><a href="#" @click="selectTrack(track._id,$event)"><i ref="hola" class="fas fa-play" id="playIcon"></i></a></td>
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
export default {
    name:'List',
    data:()=>{
        return{
            tracks:[],
            id:'',
            playit:'',
            activo:null,
            pos:0,
            trs:null,
            repeat:0
        }
    },
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
    mounted(){
        fetch('http://localhost:3000/track/')
            .then(response => response.json())
            .then((data)=>{
                this.tracks = data.tracks;
                
            })
            .catch(err=> console.log(err));
        EventBus.$on('paused',(element)=>{
            this.togglePlay(element)
        });
        EventBus.$on('skip',(id)=>{
            this.skip(id);
        });
        EventBus.$on('back',(id)=>{
            this.back(id);
        });
        EventBus.$on('toggle-repeat',(repeat)=>{
            this.repeat = repeat;
        })
    },
    methods:{
        togglePlay(playit){
            if(playit){
                this.activo.classList.remove('fa-pause');
                this.activo.classList.add('fa-play');
            }else{
                this.activo.classList.remove('fa-play');
                this.activo.classList.add('fa-pause');
            }
        },
        emitTrack(id,playIcon){

            if(id!=this.id && this.activo !==null){
                this.activo.classList.remove('fa-play');
                this.activo.classList.remove('fa-pause');
                this.activo.classList.remove('activo');
                this.activo.classList.add('fa-play');
            }

            if(playIcon.classList[1] == 'fa-pause'){
                playIcon.classList.remove('fa-pause');
                playIcon.classList.add('fa-play');
            }else{
                playIcon.classList.remove('fa-play');
                playIcon.classList.add('fa-pause');
                playIcon.classList.add('activo');
                
                this.activo = playIcon;
            }
            
            this.id = id;
            EventBus.$emit('toggle-play',id);
        },
        selectTrack(id,event){
            let playIcon = event.target;
            this.emitTrack(id,playIcon);
        },
        skip(id){
            this.trs = this.$el.querySelectorAll('tbody tr');
            
            let pos = 0;
            this.tracks.forEach((element,index)=>{
                if(element._id == id){
                    pos = index;
                }
            });
            if(this.repeat != 2){
                if(this.repeat == 0){
                    if(pos < this.tracks.length -1){
                        pos +=1;
                    }
                }else{
                    if(pos < this.tracks.length -1){
                        pos +=1;
                    }else{
                        pos =0;
                    }
                }   
            }
            let _id = this.tracks[pos]._id;
            let tr = this.trs[pos].childNodes[0].childNodes[0].childNodes[0];
            this.emitTrack(_id,tr);
        },
        back(id){
            this.trs = this.$el.querySelectorAll('tbody tr');
            
            let pos = 0;
            this.tracks.forEach((element,index)=>{
                if(element._id == id){
                    pos = index;
                }
            });

            if(pos > 0){
                pos -=1;
            }

            let _id = this.tracks[pos]._id;
            let tr = this.trs[pos].childNodes[0].childNodes[0].childNodes[0];
            this.emitTrack(_id,tr);
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