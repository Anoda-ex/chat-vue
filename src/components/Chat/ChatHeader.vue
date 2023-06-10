<template>
      <div class="chat__header chat__app-border-b">
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
                <!-- <div class="chat__svg-button chat__room-options">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24">
                        <path
                            id="chat-icon-menu"
                            d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"
                        ></path>
                    </svg>
                </div> -->
                <ItemMenu iconType="menu" :item="chat"></ItemMenu>
            </div>
        </div>
</template>
<script>
import ItemMenu from '../ItemMenu.vue'
export default {
    props:['chat'],
    components:{
        ItemMenu
    }
}
</script>