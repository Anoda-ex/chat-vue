<template>
    <div>
        <Menu :iconType="iconType" v-if="item.type==='user'">
            <div class="menu__list">
                <div v-if="!$store.getters.userInContacts(item.uid)" @click="$store.dispatch('addToContacts', {uid:item.uid})">
                    <div class="menu__item">Add to contacts</div>
                </div>

                <div v-else @click="deleteFromContactsPopup.show = true; deleteFromContactsPopup.uid = item.uid ">
                    <div class="menu__item">Delete from contacts</div>
                </div>
        
            </div>
        </Menu>
        <Menu :iconType="iconType" v-else-if="item.type==='private'">
            <div class="menu__list">
                <div @click="leaveChatPopup.show=true; leaveChatPopup.cid = item.cid">
                    <div class="menu__item">Delete chat</div>
                </div>
            </div>
        </Menu>
        <Menu :iconType="iconType" v-else>
            <div class="menu__list">
                <div v-if="$store.getters.chatInUserChats(item.cid)" @click.stop="inviteUsersPopup.show=true; inviteUsersPopup.chatData = item">
                    <div class="menu__item">Invite Users</div>
                </div>
                <!-- <div v-if="$store.getters.chatInUserChats(item.cid)" @click.stop="chatInfoPopup.show=true; chatInfoPopup.chatData = item">
                    <div class="menu__item">Chat Info</div>
                </div> -->
                <div v-if="$store.getters.userIsChatAdmin(item.cid)" @click="chatSettingsPopup.show=true; chatSettingsPopup.cid = item.cid">
                    <div class="menu__item">Settings</div>
                </div>
                <div v-if="!$store.getters.chatInUserChats(item.cid)" @click="$store.dispatch('addUserToChat', {uid:$store.state.user.uid, cid:item.cid})">
                    <div class="menu__item">Join to chat</div>
                </div>
                <div v-else @click="leaveChatPopup.show=true; leaveChatPopup.cid = item.cid">
                    <div class="menu__item">Leave from chat</div>
                </div>
            </div>
        </Menu>
        <ConfirmPopup
            v-if="deleteFromContactsPopup.show"
            @confirm="deleteFromContactsPopupConfirm"
            @close="deleteFromContactsPopupClose"
        >
        </ConfirmPopup>
        <InviteUsersPopup
            v-if="inviteUsersPopup.show"
            :chatData="inviteUsersPopup.chatData"
            @confirm="inviteUsersPopupConfirm"
            @close="inviteUsersPopupClose"
        ></InviteUsersPopup>
        
        <ConfirmPopup
            v-if="leaveChatPopup.show"
            :text="`Are you sure you want ${item.type==='private'?'delete':'leave from'} chat?`"
            @confirm="leaveChatPopupConfirm"
            @close="leaveChatPopupClose"
        ></ConfirmPopup>
        
        <ChatSettingsPopup
            v-if="chatSettingsPopup.show"
            :type="$store.getters.chatsDataList.find(item=>item.cid===chatSettingsPopup.cid).type" 
            :initData="$store.getters.chatsDataList.find(item=>item.cid===chatSettingsPopup.cid)"
            :isEditMode="true"
            @close="chatSettingsPopupClose"
        ></ChatSettingsPopup>

    </div>
    
</template>
<script>
import Menu from "./Menu.vue"
import InviteUsersPopup from './Popups/InviteUsersPopup.vue'
import ConfirmPopup from './Popups/ConfirmPopup.vue'
import ChatSettingsPopup from './Popups/ChatSettingsPopup.vue'
export default {
    components:{
        Menu,
        InviteUsersPopup,
        ConfirmPopup,
        ChatSettingsPopup
    },
    props:['item', 'iconType'],
    data(){
        return{
            deleteFromContactsPopup:{
                show:false,
                uid:null
            },
            inviteUsersPopup:{
                show:false,
                chatData:null
            },
            leaveChatPopup:{
                show:false,
                cid:null
            },
            chatSettingsPopup:{
                show:false,
                cid:null
            },
            
            
        }
    },
    methods:{
        deleteFromContactsPopupClose(){
            this.deleteFromContactsPopup.show=false;
            this.deleteFromContactsPopup.uid=null;
        },
        deleteFromContactsPopupConfirm(){
            this.$store.dispatch('deleteFromContacts', {uid:this.deleteFromContactsPopup.uid}).then(res=>{
                this.deleteFromContactsPopupClose();
            })
        },
        inviteUsersPopupClose(){
            this.inviteUsersPopup.show=false;
            this.inviteUsersPopup.cid=false;
        },
        inviteUsersPopupConfirm(uidList){
            uidList.forEach(uid=>{
                this.$store.dispatch('addUserToChat',{cid:this.inviteUsersPopup.chatData.cid, uid:uid})
            });
            this.inviteUsersPopupClose();
        },
        leaveChatPopupClose(){
            this.leaveChatPopup.show=false;
            this.leaveChatPopup.cid=null;
            
        },
        leaveChatPopupConfirm(){
            this.$store.dispatch('deleteUserFromChat', {cid:this.leaveChatPopup.cid});
            this.leaveChatPopupClose();
        },
        chatSettingsPopupClose(){
            this.chatSettingsPopup.show = false;
            this.chatSettingsPopup.cid = false;
        },
       

    },
    computed:{

    }, 
}
</script>