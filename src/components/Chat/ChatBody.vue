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
                            <div id="PcR4wpGFLPQFffCrftru" class="chat__message-wrapper">
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
                                                <!-- <span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24" class="chat__icon-check">
                                                        <path
                                                            id="chat-icon-double-checkmark"
                                                            d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"
                                                        ></path>
                                                    </svg>
                                                </span> -->
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
                        </div>
                    </span>
                </div>
            </div>
        </div>
</template>
<script>
export default {
    props:[
        'chat'
    ]
}
</script>