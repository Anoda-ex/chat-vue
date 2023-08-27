<template>
    <div>
        <div>
            <div class="chat-audio-player">
                <div class="chat__svg-button">
                    <svg v-if="!playing" @click="play" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 48 48"><path id="vac-icon-audio-play" d="M43.331,21.237L7.233,0.397c-0.917-0.529-2.044-0.529-2.96,0c-0.916,0.528-1.48,1.505-1.48,2.563v41.684   c0,1.058,0.564,2.035,1.48,2.563c0.458,0.268,0.969,0.397,1.48,0.397c0.511,0,1.022-0.133,1.48-0.397l36.098-20.84   c0.918-0.529,1.479-1.506,1.479-2.564S44.247,21.767,43.331,21.237z"></path></svg>
                    <svg v-else @click="pause" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 48 48"><path id="vac-icon-audio-pause" d="M17.991,40.976c0,3.662-2.969,6.631-6.631,6.631l0,0c-3.662,0-6.631-2.969-6.631-6.631V6.631C4.729,2.969,7.698,0,11.36,0l0,0c3.662,0,6.631,2.969,6.631,6.631V40.976z"></path><path id="vac-icon-audio-pause" d="M42.877,40.976c0,3.662-2.969,6.631-6.631,6.631l0,0c-3.662,0-6.631-2.969-6.631-6.631V6.631C29.616,2.969,32.585,0,36.246,0l0,0c3.662,0,6.631,2.969,6.631,6.631V40.976z"></path></svg>
                </div>
                <div class="chat-player-bar">
                    <!-- <div class="chat-player-progress">
                        <div class="chat-line-container">
                            <div class="chat-line-progress" style="width: 0%;"></div>
                            <div class="chat-line-dot" style="left: 0%;"></div>
                        </div>
                    </div> -->
                    <input class="chat-audio-range" type="range" min="0" max="100" step="1" :value="currentTime" @change="changeCurrentTime"/>
                </div>
                <audio ref="audioPlayer" :src="source"></audio>
            </div>
        </div>
        <div v-if="currentTime" class="vac-progress-time">{{formatMilliseconds(currentTime*1000)}}</div>
        <div v-else-if="duration" class="vac-progress-time">{{duration}}</div>
        <div v-else class="vac-progress-time">--:--</div>
    </div>
</template>
<script>
import {formatMilliseconds} from '../../../helpers/functions'
export default {
    props:['message'],
    data(){
        return{
            audioPlayer:null,
            playing:false,
            duration:0,
            currentTime:0,
        }
    },
    methods:{
        play(){
            this.audioPlayer.play();
            this.playing=true;
        },
        pause(){
            this.audioPlayer.pause();
            this.playing=false;
        },
        changeCurrentTime(event){
            console.log('changeCurrentTime', event);
            this.audioPlayer.currentTime=0;
        },
        reset(){
            this.playing = false
            this.currentTime = 0;
            this.audioPlayer.currentTime = 0;
        },
        timeupdateListener(event){
            console.log('timeupdate', event);
            this.currentTime=this.audioPlayer.currentTime
        },
        endedListener(event){
            this.reset()
        },
        loadeddataListener(event){
            this.duration=this.audioPlayer.duration;

            if (this.audioPlayer === Infinity) {
                this.audioPlayer.currentTime = 10000000;
                setTimeout(() => {
                    this.audioPlayer.currentTime = 0; // to reset the time, so it starts at the beginning
                }, 1000);
            }
            this.duration=this.audioPlayer.duration;
        },
        durationchangeListener(event){
            console.log('durationchangeListener', event, this.audioPlayer.duration);
            // this.duration=this.audioPlayer.duration;
        },
        formatMilliseconds
    },
    computed:{
        source(){
            if(this.message.messageBody){
                return this.message.messageBody.voiceMessageData;
            }
        },
 
    },
    mounted(){
        this.audioPlayer=this.$refs.audioPlayer;
        this.audioPlayer.addEventListener('timeupdate', this.timeupdateListener);
        this.audioPlayer.addEventListener('ended', this.endedListener);
        this.audioPlayer.addEventListener('durationchange', this.durationchangeListener);
        this.audioPlayer.addEventListener('loadeddata', this.loadeddataListener);
    },
    beforeDestroy(){
        this.audioPlayer.removeEventListener('timeupdate', this.timeupdateListener);
        this.audioPlayer.removeEventListener('ended', this.endedListener);
        this.audioPlayer.removeEventListener('durationchange', this.durationchangeListener);
        this.audioPlayer.removeEventListener('loadeddata', this.loadeddataListener);


    }
}
</script>