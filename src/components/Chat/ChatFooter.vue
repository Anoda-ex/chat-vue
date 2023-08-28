<template>
    <div id="room-footer" class="chat__room-footer" style="">
        <div v-if="userNotInChat" @click="$store.dispatch('addUserToChat', {uid:$store.state.user.uid, cid:chat.cid})" class="chat__box-footer chat__box-footer-border chat-footer-button">
            Join to the chat
        </div>
        <div v-else class="chat__box-footer chat__box-footer-border">
            <AudioMessageRecord @sendMessageHandler="sendMessageHandler"></AudioMessageRecord>
            <textarea
                id="roomTextarea"
                class="chat__textarea"
                style="min-height: 20px; padding-left: 12px; height: 20px"
                v-model="inputValue"

            ></textarea>
            <div class="chat__icon-textarea">
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
import AudioMessageRecord from './MessageComponents/AudioMessageRecord.vue';

export default {
    props: ['chat', 'userNotInChat', 'userNotInPrivate'],
    components: [AudioMessageRecord],
    data() {
        return {
            inputValue: '',
        };
    },
    methods: {
        sendMessageHandler({voiceMessageData}) {
            let messagePayload = {
                textMessageData: this.inputValue.trim(),
                voiceMessageData: voiceMessageData
            }
            if (this.userNotInPrivate) {
                this.$store.dispatch('createPrivateChatData', {
                    contactUid: this.chat.uid
                }).then((res => {
                    this.$store.commit('selectChat', { item: this.$store.getters.getChatData(res.cid) });
                    this.sendMessage( res.cid , messagePayload);
                }));
            }
            else {
                this.sendMessage( this.chat.cid, messagePayload);
            }
        },
        sendMessage(cid, messagePayload) {
            this.$store.dispatch('sendMessage', {
                cid: cid,
                text: messagePayload.textMessageData,
                voiceMessageData: messagePayload.voiceMessageData
            }).then(res => {
                this.inputValue = null;
                this.$emit('scrollMessagesDown');
            });
        }
    },
    computed: {
        disableSendMessageButton() {
            return !(this.inputValue && this.inputValue.trim());
        }
    },
    components: { AudioMessageRecord }
}
</script>