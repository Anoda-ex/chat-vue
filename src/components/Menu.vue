<template>
    <div class="menu">
        <div v-if="iconType==='menu'" @click="isOpened=true" class="chat__svg-button chat__room-options">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24"><path id="chat-icon-menu" d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"></path><!----></svg>
        </div>
        <div v-if="iconType==='sidebarItem'" @click="isOpened=true" class="chat__svg-button room__options" >
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24"> <path id="chat-icon-dropdown-room" d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" ></path> </svg>
        </div>
        <div v-if="isOpened" class="menu__options" v-click-outside="()=>{isOpened=false}">
            <slot></slot>
        </div>
    </div>
</template>
<script>
export default {
    props:['iconType'],
    data(){
        return{
            isOpened:false
        }
    },
    methods:{
        test(){
            console.log('test');
        }
    }
}
</script>