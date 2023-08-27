<template>
    <div class="">
        <div v-if="isLoginForm" class="login__title">Your info</div>
        <div class="avatar-wrapper">
            <div class="avatar" @click="$refs.imageInputRef.click()">
                <input ref="imageInputRef" style="display:none" type="file" @change="selectFile($event)" accept="image/*"/>
                <img :src="avatarSrc" alt="">
            </div>
        </div>
        <div class="form-block mt-20">
            <div class="form-text login__left-padding">Name</div>
            <input class="form-input"  v-model="values.name.value"/>
            <div class="form-error" v-if="values.name.error">
                <img :src="require('../assets/img/error-icon.svg')"/>
                {{this.values.name.error}}
            </div>
        </div>
        <div class="form-block">
            <div class="form-text login__left-padding">Username</div>
            <input class="form-input"  v-model="values.username.value"/>
            <div class="form-error" v-if="values.username.error">
                <img :src="require('../assets/img/error-icon.svg')"/>
                {{this.values.username.error}}
            </div>
        </div>
        <div class="form-block">
            <div class="form-text login__left-padding">Description</div>
            <input class="form-input"  v-model="values.description.value"/>
            <div class="form-error" v-if="values.description.error">
                <img :src="require('../assets/img/error-icon.svg')"/>
                {{this.values.description.error}}
            </div>
        </div>
        <div class="flex-center mt-30">
            <button @click="confirm" class="btn btn--blue mt-40">Confirm</button>
        </div>
        
        
    </div>
</template>
<script>
export default {
    props:['isLoginForm', 'initData'],
    data(){
        return{
            loadedAvatar:null,
            values:{
                name:{
                    value:null,
                    error:null
                },
                username:{
                    value:null,
                    error:null
                },
                description:{
                    value:null,
                    error:null
                },
            }
        }
    },
    methods:{
        selectFile(event){
            let file=event.target.files[0]
            if(file){
                let reader  = new FileReader();
                reader.onloadend = (image)=> {
                    if(image.target.result.match(image)){
                        this.loadedAvatar = image.target.result
                        
                    }
                }
                reader.readAsDataURL(file)
            }
        },
        confirm(){
            let isError;
            if(!this.values.name.value || this.values.name.value.length===0){
                this.values.name.error="Required field."
                isError=true
            }
            if(!this.values.username.value || this.values.username.value.length===0){
                this.values.username.error="Required field."
                isError=true
            }
            if(isError) return
            this.$store.dispatch('changeUserData', {
                name: this.values.name.value,
                username: this.values.username.value,
                description: this.values.description.value,
                image:this.loadedAvatar
            }).then(res=>{
                this.$emit('close')
            
            })
            
        }
    },
    computed:{
        avatarSrc(){
            return this.loadedAvatar || require('../assets/img/no-image.jpg')
        }
    },
    created(){
        if(!this.isLoginForm && this.initData){
            this.loadedAvatar = this.initData.image||null
            this.values.name.value = this.initData.name||null
            this.values.username.value = this.initData.username||null
            this.values.description.value = this.initData.description||null
        }
    }
}
</script>