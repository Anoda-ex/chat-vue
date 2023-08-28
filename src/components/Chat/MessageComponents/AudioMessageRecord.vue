<template>
    <div class="chat__icon-textarea-left" v-if="!voiceMessage.active" @click="voiceMessageStart">
        <div class="chat__svg-button">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 512 512" class="chat__icon-microphone">
                <path id="chat__icon-microphone" d="M432.8,216.4v39.2c0,45.2-15.3,84.3-45.2,118.4c-29.8,33.2-67.3,52.8-111.6,57.9v40.9h78.4c5.1,0,10.2,1.7,13.6,6c4.3,4.3,6,8.5,6,13.6c0,5.1-1.7,10.2-6,13.6c-4.3,4.3-8.5,6-13.6,6H157.6c-5.1,0-10.2-1.7-13.6-6c-4.3-4.3-6-8.5-6-13.6c0-5.1,1.7-10.2,6-13.6c4.3-4.3,8.5-6,13.6-6H236v-40.9c-44.3-5.1-81.8-23.9-111.6-57.9s-45.2-73.3-45.2-118.4v-39.2c0-5.1,1.7-10.2,6-13.6c4.3-4.3,8.5-6,13.6-6s10.2,1.7,13.6,6c4.3,4.3,6,8.5,6,13.6v39.2c0,37.5,13.6,70.7,40,97.1s59.6,40,97.1,40s70.7-13.6,97.1-40c26.4-26.4,40-59.6,40-97.1v-39.2c0-5.1,1.7-10.2,6-13.6c4.3-4.3,8.5-6,13.6-6c5.1,0,10.2,1.7,13.6,6C430.2,206.2,432.8,211.3,432.8,216.4z M353.5,98v157.6c0,27.3-9.4,50.3-29,69c-19.6,19.6-42.6,29-69,29s-50.3-9.4-69-29c-19.6-19.6-29-42.6-29-69V98c0-27.3,9.4-50.3,29-69c19.6-19.6,42.6-29,69-29s50.3,9.4,69,29C344.2,47.7,353.5,71.6,353.5,98z"></path>
            </svg>
        </div>
    </div>
    <template v-else>
        <div class="chat__icon-textarea-left">
            <div class="chat__svg-button chat-icon-audio-stop" @click="voiceMessageStop">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24"><path id="chat-icon-close-outline" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"></path></svg>
            </div>
            <div class="chat-dot-audio-record"></div>
            <div class="chat-dot-audio-record-time">{{formatMilliseconds(voiceMessage.time)}}</div>
            <div class="chat__svg-button chat-icon-audio-confirm" @click="voiceMessageConfirm">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24"><path id="chat__icon-checkmark" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"></path></svg>
            </div>
        </div>
    </template>
</template>
<script>
import {formatMilliseconds} from '../../../helpers/functions'
export default {
    props:['chat', 'userNotInChat', 'userNotInPrivate'],
    data(){
        return{
            voiceMessageData:null,
            voiceMessage:{
                active:false,
                interval:null,
                time:null,
            },
        }
    },
    methods:{
        formatMilliseconds,
        async voiceMediaRecorderDataAvailable(event){
            const audioBlob = new Blob([event.data], {
                type: 'audio/wav'
            });
            var reader = new FileReader();
            reader.onload = (event) => {
                let audioData = event.target.result;
                this.voiceMessageReset();
                this.$emit('sendMessageHandler', {voiceMessageData: audioData})
            };
            reader.readAsDataURL(audioBlob);
            
        },
        voiceMessageReset(){
            this.voiceMessage.active=false;
            this.voiceMessage.time=0;
            if(this.voiceMessage.interval){
                clearInterval(this.voiceMessage.interval)
                this.voiceMessage.interval=null
            }
            if(this.voiceMessage.mediaRecorder){
                this.voiceMessage.mediaRecorder.stop();
                this.voiceMessage.mediaRecorder.removeEventListener("dataavailable",this.voiceMediaRecorderDataAvailable);
                this.voiceMessage.mediaRecorder=null;
            }

        },
        voiceMessageStart(){
            window.navigator.mediaDevices.getUserMedia({ audio: true})
                .then(stream => {
                    this.voiceMessage.mediaRecorder = new MediaRecorder(stream);
                    this.voiceMessage.mediaRecorder.addEventListener("dataavailable", this.voiceMediaRecorderDataAvailable);
                    this.voiceMessage.mediaRecorder.start();
                    this.voiceMessage.active = true;
                    this.voiceMessage.time=0;
                    this.voiceMessage.interval = setInterval(() => {
                        this.voiceMessage.time=this.voiceMessage.time+1000;
                    }, 1000);
                })
        },
        voiceMessageStop(){
            this.voiceMessageReset()
        },
        voiceMessageConfirm(){
            this.voiceMessage.mediaRecorder.stop();
        },
       
    },
    computed:{
        disableSendMessageButton(){
            return !(this.inputValue && this.inputValue.trim())
        }

    }
}
</script>