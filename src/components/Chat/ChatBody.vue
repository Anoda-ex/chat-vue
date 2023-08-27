<template>
       <div id="messages-list" ref="messages" class="chat__container-scroll">
            <div class="chat__messages-container">
                <div class="">
                    <div>
                        <div class="chat__text-started" v-if="chat.startDate">
                            Conversation started on: {{chat.startDate}}
                        </div>
                    </div>
                    <span>
                        <div class="chat__message" v-for="message in chat.messagesData" :key="message.mid">
                            <Message :message="message"></Message>
                            <!-- <div id="PcR4wpGFLPQFffCrftru" class="chat__message-wrapper">
                                <div class="chat__message-box " :class="{'chat__offset-current':message.isMyMessage}">
                                    <div class="chat__message-container">
                                        <div class="chat__message-card " :class="{'chat__message-current':message.isMyMessage}">
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
                            </div> -->
                        </div>
                    </span>
                </div>
            </div>
        </div>
</template>
<script>
import Message from "./Message.vue"
export default {
    components:{
        Message
    },
    props:[
        'chat'
    ]
}
</script>