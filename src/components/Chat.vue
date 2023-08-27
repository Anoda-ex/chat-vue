<template>
    <div v-if="!chat" class="no-chat-wrapper">
        <div class="no-chat-wrapper__message">
            Select a chat for messaging...
        </div>
    </div>
    <div v-else class="chat">
      
        <ChatHeader :chat="chat"></ChatHeader>
        
        <ChatBody :chat="chat"></ChatBody>
        <ChatFooter 
            :chat="chat" 
            :userNotInChat="userNotInChat" 
            :userNotInPrivate="userNotInPrivate" 
            @scrollMessagesDown="scrollMessagesDown"
        ></ChatFooter>
      
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
    
        }
    },
    methods:{
       scrollMessagesDown(){
            // let messagesElement=this.$refs.messages;
            let messagesElement=document.querySelector('.chat__container-scroll');
            console.log('messagesElement',messagesElement);
            if(messagesElement){
                messagesElement.scroll({
                    top: messagesElement.scrollHeight, 
                    behavior: "smooth"
                })
            }
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