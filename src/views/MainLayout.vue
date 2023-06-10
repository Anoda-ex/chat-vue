<template>
  <div>
    <div class="window-container">
        <div class="chat-card-window">
            <div class="chat-chat-container">

                <Sidebar></Sidebar>
                <Chat></Chat>
             
            
            </div>
        </div>
    </div>
  </div>
</template>
<script>
import Chat from "../components/Chat.vue"
import Sidebar from "../components/Sidebar.vue"
export default {
    components:{
        Chat,
        Sidebar
    }
    
}
</script>