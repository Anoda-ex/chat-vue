<template>
    <div class="room__item menu-event-area" ref="roomItem" @click="selectChat(item)" :class="{'room__item--selected':($store.getters.selectedChat && $store.getters.selectedChat.cid)===item.cid}">
        <div class="room__container">
            <div class="chat-avatar">
                <img :src="item.image"/> 
            </div>
            <div class="room__name-containe">
                <div class="room__title-container">
                    <div class="chat__room-name chat__text-ellipsis">
                        {{item.name}}
                    </div>
                    <div class="room__text-date">{{item.time}}</div>
                </div>
                <div class="room__text-last">
                    <span>
                        <!-- <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24" class="chat__icon-check"> <path id="chat-icon-double-checkmark" d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z" ></path></svg> -->
                    </span>
                    <div class="chat__format-message-wrapper chat__text-ellipsis">
                        <div class="chat__text-ellipsis">
                            <div class="chat__format-container">
                                <span class="chat__text-ellipsis"><span>{{item.lastMessageText}}</span></span>
                            </div>
                        </div>
                    </div>
                    <div class="chat__room-options-container">
                        <ItemMenu :item="item" iconType="sidebarItem" ></ItemMenu>
                    </div>
                </div>
            </div>
        </div>
    </div>
    

</template>
<script>
import ItemMenu from "./ItemMenu.vue"
import ConfirmPopup from './Popups/ConfirmPopup.vue'
import InviteUsersPopup from './Popups/InviteUsersPopup.vue'
export default {
    components:{
        ConfirmPopup,
        InviteUsersPopup,
        ItemMenu
    },
    props:['item'],
    data(){
        return{
         
           
        }
    },
    methods:{
        selectChat(item){
            // console.log('selectChat', document.querySelector('menu__options--opened'));
            if(this.$refs.roomItem && document.querySelector('.menu__options--opened')){
                return
            }
            let sidebarButton = document.querySelector('.chat__header-sidebar-button')
            if(sidebarButton){
                sidebarButton.classList.remove('chat__rotate-icon')
            }
            this.$store.commit('selectChat', {item:item});
        }
      

    },
    computed:{

    }, 
}
</script>