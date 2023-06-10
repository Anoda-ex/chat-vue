<template>
    <div v-if="!chat" class="no-chat-wrapper">
        <div class="no-chat-wrapper__message">
            Select a chat for messaging...
        </div>
    </div>
    <div v-else class="chat">
        <!-- <div class="chat__header chat__app-border-b">
            <div class="chat__header-wrapper">
                <div class="chat__svg-button chat__toggle-button chat__rotate-icon-init" @click="$event.target.closest('.chat__svg-button').classList.toggle('chat__rotate-icon')">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24"  viewBox="0 0 24 24" >
                        <path
                            id="chat-icon-toggle"
                            d="M5,13L9,17L7.6,18.42L1.18,12L7.6,5.58L9,7L5,11H21V13H5M21,6V8H11V6H21M21,16V18H11V16H21Z"
                        ></path>
                    </svg>
                </div>
                <div class="chat__info-wrapper">
                    <div class="chat-avatar">
                        <img :src="chat.image" alt="">    
                    </div>  
                    <div class="chat__text-ellipsis" @click="scrollMessagesDown">
                        <div class="chat__room-name chat__text-ellipsis">{{chat.name}}</div>
                        <div class="chat__room-info chat__text-ellipsis"></div>
                    </div>
                </div>
                <div class="chat__svg-button chat__room-options">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24">
                        <path
                            id="chat-icon-menu"
                            d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"
                        ></path>
                    </svg>
                </div>
            </div>
        </div> -->
        <ChatHeader :chat="chat"></ChatHeader>
        <!-- <div id="messages-list" ref="messages" class="chat__container-scroll">
            <div class="chat__messages-container">
                <div class="">
                    <div>
                        <div class="chat__text-started">
                            Conversation started on: 26 May 2023
                        </div>
                    </div>
                    <span>
                        <div class="chat__message" v-for="item in 30" :key="item">
                            <div id="PcR4wpGFLPQFffCrftru" class="chat__message-wrapper">
                                <div class="chat__message-box chat__offset-current">
                                    <div class="chat__message-container">
                                        <div class="chat__message-card chat__message-current">
                                            <div class="chat__format-message-wrapper">
                                                <div class="">
                                                    <div class="chat__format-container">
                                                        <span class="">
                                                            <span>
                                                                43214231
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="chat__text-timestamp">
                                                <span>17:41</span>
                                                <span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24" class="chat__icon-check">
                                                        <path
                                                            id="chat-icon-double-checkmark"
                                                            d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"
                                                        ></path>
                                                    </svg>
                                                </span>
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
        </div> -->
        <ChatBody :chat="chat"></ChatBody>
        <ChatFooter :chat="chat" :userNotInChat="userNotInChat" :userNotInPrivate="userNotInPrivate"></ChatFooter>
      
    </div>
</template>
<script>
import ChatFooter  from "./Chat/ChatFooter.vue";
import ChatBody  from "./Chat/ChatBody.vue";
import ChatHeader  from "./Chat/ChatHeader.vue";
export default {
    components:{
        ChatFooter,
        ChatBody,
        ChatHeader
    },
    data(){
        return{
            // messages:[
            //     {
            //         text:nine,
            //     }
            // ]
        }
    },
    methods:{
        scrollMessagesDown(){
            let messagesElement=this.$refs.messages;
            // messagesElement.scrollTo(messagesElement.scrollHeight)
            messagesElement.scroll({
                top: messagesElement.scrollHeight, 
                behavior: "smooth"
            })
        },
        
    },
    computed:{
        chat(){
            return this.$store.getters.selectedChat
        },
        userNotInChat(){
            return this.chat.uid ? false : this.chat.userNotInChat 
        },
        userNotInPrivate(){
            return this.chat.uid ? this.chat.userNotInChat : false

        }
    }
}
</script>