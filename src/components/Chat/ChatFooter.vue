<template>
    <div id="room-footer" class="chat__room-footer" style="">
        <div v-if="userNotInChat" @click="$store.dispatch('addUserToChat', {uid:$store.state.user.uid, cid:chat.cid})" class="chat__box-footer chat__box-footer-border chat-footer-button">
                Join to the chat
        </div>
        <div v-else class="chat__box-footer chat__box-footer-border">
            <!-- <div class="chat__icon-textarea-left">
                <div class="chat__svg-button">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 512 512" class="chat__icon-microphone">
                        <path id="chat__icon-microphone" d="M432.8,216.4v39.2c0,45.2-15.3,84.3-45.2,118.4c-29.8,33.2-67.3,52.8-111.6,57.9v40.9h78.4c5.1,0,10.2,1.7,13.6,6c4.3,4.3,6,8.5,6,13.6c0,5.1-1.7,10.2-6,13.6c-4.3,4.3-8.5,6-13.6,6H157.6c-5.1,0-10.2-1.7-13.6-6c-4.3-4.3-6-8.5-6-13.6c0-5.1,1.7-10.2,6-13.6c4.3-4.3,8.5-6,13.6-6H236v-40.9c-44.3-5.1-81.8-23.9-111.6-57.9s-45.2-73.3-45.2-118.4v-39.2c0-5.1,1.7-10.2,6-13.6c4.3-4.3,8.5-6,13.6-6s10.2,1.7,13.6,6c4.3,4.3,6,8.5,6,13.6v39.2c0,37.5,13.6,70.7,40,97.1s59.6,40,97.1,40s70.7-13.6,97.1-40c26.4-26.4,40-59.6,40-97.1v-39.2c0-5.1,1.7-10.2,6-13.6c4.3-4.3,8.5-6,13.6-6c5.1,0,10.2,1.7,13.6,6C430.2,206.2,432.8,211.3,432.8,216.4z M353.5,98v157.6c0,27.3-9.4,50.3-29,69c-19.6,19.6-42.6,29-69,29s-50.3-9.4-69-29c-19.6-19.6-29-42.6-29-69V98c0-27.3,9.4-50.3,29-69c19.6-19.6,42.6-29,69-29s50.3,9.4,69,29C344.2,47.7,353.5,71.6,353.5,98z"></path>
                    </svg>
                </div>
            </div> -->
            <textarea
                id="roomTextarea"
                placeholder="Type message"
                class="chat__textarea"
                style="min-height: 20px; padding-left: 12px; height: 20px"
                v-model="inputValue"

            ></textarea>
            <div class="chat__icon-textarea">
      
                <!-- <div class="chat__svg-button">
                    <svg xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24">
                        <path id="chat-icon-paperclip" d="M16.5,6V17.5A4,4 0 0,1 12.5,21.5A4,4 0 0,1 8.5,17.5V5A2.5,2.5 0 0,1 11,2.5A2.5,2.5 0 0,1 13.5,5V15.5A1,1 0 0,1 12.5,16.5A1,1 0 0,1 11.5,15.5V6H10V15.5A2.5,2.5 0 0,0 12.5,18A2.5,2.5 0 0,0 15,15.5V5A4,4 0 0,0 11,1A4,4 0 0,0 7,5V17.5A5.5,5.5 0 0,0 12.5,23A5.5,5.5 0 0,0 18,17.5V6H16.5Z"></path>
                    </svg>
                </div> -->
                <input type="file" multiple="" accept="*" style="display: none"/>
                <div @click="sendMessageHandler" class="chat__svg-button" :class="{'chat-send-disabled':disableSendMessageButton}">
                    <svg v-if="disableSendMessageButton" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24">
                        <path id="chat-icon-send-disabled" d="M2,21L23,12L2,3V10L17,12L2,14V21Z"></path>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24"><path id="chat-icon-send" d="M2,21L23,12L2,3V10L17,12L2,14V21Z"></path>v-if="" </svg>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:['chat', 'userNotInChat', 'userNotInPrivate'],
    data(){
        return{
            inputValue:null
        }
    },
    methods:{
        sendMessageHandler(){

            if(this.userNotInPrivate){
                this.$store.dispatch('createPrivateChatData', {
                    contactUid: this.chat.uid
                }).then((res=>{
                    console.log('sendMessageHandler', res);
                    this.$store.commit('selectChat', {item:this.$store.getters.getChatData(res.cid)})
                    this.sendMessage({cid: res.cid})
                }))
            }else{
                 this.sendMessage({cid: this.chat.cid})
            }
        },
        sendMessage({cid}){
            this.$store.dispatch('sendMessage',{
                cid: cid,
                text: this.inputValue,
            }).then(res=>{
                this.inputValue=null
            })

        }
    },
    computed:{
        disableSendMessageButton(){
            return !this.inputValue
        }

    }
}
</script>