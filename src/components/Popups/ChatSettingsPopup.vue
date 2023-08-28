<template>
    <div class="popup" v-if="step===1">
        <div class="overlay">
            <div class="popup__wrapper" v-click-outside="()=>{$emit('close')}">
                <div class="popup__header">
                    <div class="poput-title">{{popupTitle}}</div>
                    <div @click="$emit('close')" class="popup__close">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="512px" id="Layer_1" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" width="512px" xml:space="preserve"><path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z"/></svg>
                    </div>
                </div>
                <div class="popup__body">
                    <div class="">
                        <div class="avatar-wrapper">
                            <div class="avatar" @click="$refs.imageInputRef.click()">
                                <input ref="imageInputRef" style="display:none" type="file" @change="selectFile($event)" accept="image/*" />
                                <img :src="avatarSrc" alt="">
                            </div>
                        </div>
                        <div class="form-block">
                            <div class="form-text login__left-padding">{{typeName}} name</div>
                            <input class="form-input" v-model="valuesData.name.value" />
                            <div class="form-error" v-if="valuesData.name.error">
                                <img :src="require('../../assets/img/error-icon.svg')" /> {{this.valuesData.name.error}}
                            </div>
                        </div>
                        <div class="form-block">
                            <div class="form-text login__left-padding">{{typeName}} identifier</div>
                            <input class="form-input" v-model="valuesData.username.value" />
                            <div class="form-error" v-if="valuesData.username.error">
                                <img :src="require('../../assets/img/error-icon.svg')" /> {{this.valuesData.username.error}}
                            </div>
                        </div>
                        <div class="form-block">
                            <div class="form-text login__left-padding">{{typeName}} description</div>
                            <input class="form-input" v-model="valuesData.description.value" />
                            <div class="form-error" v-if="valuesData.description.error">
                                <img :src="require('../../assets/img/error-icon.svg')" /> {{this.valuesData.description.error}}
                            </div>
                        </div>
                        <div class="flex-center mt-30">
                            <button @click="confirm" class="btn btn--blue mt-40">Confirm</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <InviteUsersPopup 
        v-else
        :chatData="createdChatData"
        @confirm="inviteUsersPopupConfirm"
        @close="inviteUsersPopupClose"
    ></InviteUsersPopup>

</template>
<script>
    import InviteUsersPopup from "./InviteUsersPopup"
    export default {
        components:{
            InviteUsersPopup
        },
        props: ['type', 'isEditMode', 'initData'],
        data() {
            return {
                step:1,
                loadedAvatar: null,
                createdChatData:null,
                valuesData: {
                    name: {
                        value: '22',
                        error: null
                    },
                    username: {
                        value: null,
                        error: null
                    },
                    description: {
                        value: null,
                        error: null
                    },
                },
                
            }
        },
        methods: {
            selectFile(event) {
                let file = event.target.files[0]
                if (file) {
                    let reader = new FileReader();
                    reader.onloadend = (image) => {
                        if (image.target.result.match(image)) {
                            this.loadedAvatar = image.target.result
                        }
                    }
                    reader.readAsDataURL(file)
                }
            },
            confirm() {
                let isError;
                if (!this.valuesData.name.value || this.valuesData.name.value.length === 0) {
                    this.valuesData.name.error = "Required field."
                    isError = true
                }
                if (!this.valuesData.username.value || this.valuesData.username.value.length === 0) {
                    this.valuesData.username.error = "Required field."
                    isError = true
                }
                if (isError) return
                this.$store.dispatch('changeChatData', {
                    cid: this.initData ? this.initData.cid : null,
                    isEditMode: this.isEditMode,
                    chatData: {
                        name: this.valuesData.name.value,
                        description: this.valuesData.description.value,
                        image: this.loadedAvatar,
                        username:this.valuesData.username.value,
                        ...(this.isEditMode ? {} : {
                            type: this.type
                        })
                    }
                }).then(res => {
                    if(!this.isEditMode){
                        if(res){
                            this.createdChatData=res;
                            this.step=2;
                            return
                        }
                    }
                    this.$emit('close')
                })
            },

            inviteUsersPopupClose(){
                this.$emit('close')
            },
            inviteUsersPopupConfirm(uidList){
                uidList.forEach(uid=>{
                    this.$store.dispatch('addUserToChat',{cid:this.createdChatData.cid, uid:uid})
                });
                this.inviteUsersPopupClose();
            },
        },
        computed: {
            avatarSrc() {
                return this.loadedAvatar || require('../../assets/img/no-image.jpg')
            },
            typeName() {
                if (this.type === "channel") {
                    return 'Channel'
                } else if (this.type === "group") {
                    return "Chat"
                }
            },
            popupTitle() {
                if (this.type === "channel") {
                    return this.isEditMode ? "Edit channel settings" : "Create channel"
                } else if (this.type === "group") {
                    return this.isEditMode ? "Edit chat settings" : "Create chat"
                }
            }
        },
        created() {
            if (!this.isLoginForm && this.initData) {
                this.loadedAvatar = this.initData.image || null
                this.valuesData.name.value = this.initData.name || null
                this.valuesData.username.value = this.initData.username || null
                this.valuesData.description.value = this.initData.description || null
            }
        }
    }
</script>