<template>
    
    <div :id="message.mid" class="chat__message-wrapper">
        <div class="chat__message-box " :class="{'chat__offset-current':message.isMyMessage}">
            <div class="chat__message-container">
                <div class="chat-avatar" v-if="chat.type!=='private' && !message.isMyMessage && message.userData">
                    <img :src="message.userData.image" alt="">
                </div>
                <div class="chat__message-card " :class="{'chat__message-my-message':message.isMyMessage}">
                    <div class="chat__format-message-username" v-if="chat.type!=='private' && !message.isMyMessage && message.userData">
                        {{ message.userData.name }}
                    </div>
                    <template v-if="message.type==='voiceMessage'" >
                        <AudioMessage :message="message"></AudioMessage>
                    </template>
                    <template v-else>
                        <div class="chat__format-message-wrapper">
                            <div class="">
                                <div class="chat__format-container">
                                    <span class="">
                                        <span>
                                            {{message.messageBody.text}}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </template>

                    <div class="chat__text-timestamp">
                        <span>{{message.time}}</span>    
                    </div>
                    <div class="chat__message-actions-wrapper">
                        <div class="chat__message-options-container" style="display: initial; width: 70px" >
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
                       
</template>
<script>
import AudioMessage from './MessageComponents/AudioMessage.vue'
export default {
    components:{AudioMessage},
    props:[
        'chat',
        'message'
    ],

}
</script>