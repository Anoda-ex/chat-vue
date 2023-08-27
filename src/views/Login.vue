<template>
    <div>
        <div class="login" v-if="step===1">
            <div class="login__wrapper">
                <div class="login__logo"></div>
                <div class="login__title">Welcome to Chatter!</div>
                <div class="login__subtitle">Exchange messages with your friends for free</div>
                <div class="form-block mt-40">
                    <div class="form-text login__left-padding">Email address</div>
                    <input class="form-input" v-model="values.email.value"/>
                    <div class="form-error" v-if="values.email.error">
                        <img :src="require('../assets/img/error-icon.svg')"/>
                        {{values.email.error}}
                    </div>
                </div>
                <div class="form-block">
                    <div class="form-text login__left-padding">Password</div>
                    <div class="form-input-wrapper"> 
                        <input :type="values.password.symbolsVisible?'text':'password'" class="form-input" v-model="values.password.value"/>
                        <div @click="values.password.symbolsVisible=!values.password.symbolsVisible" class="form-input-icon">
                            <img v-if="values.password.symbolsVisible" :src="require('../assets/img/password-hidden.svg')"/>
                            <img v-else :src="require('../assets/img/password-visible.svg')"/>
                        </div>
                    </div>
                    <div class="form-error" v-if="values.password.error">
                        <img :src="require('../assets/img/error-icon.svg')"/>
                        {{this.values.password.error}}
                    </div>
                </div>
                <div class="form-block" v-if="!signInForm">
                    <div class="form-text login__left-padding">Repeat password</div>
                     <div class="form-input-wrapper"> 
                        <input :type="values.passwordRepeat.symbolsVisible?'text':'password'" class="form-input"  v-model="values.passwordRepeat.value"/>
                        <div @click="values.passwordRepeat.symbolsVisible=!values.passwordRepeat.symbolsVisible" class="form-input-icon">
                            <img v-if="values.passwordRepeat.symbolsVisible" :src="require('../assets/img/password-hidden.svg')"/>
                            <img v-else :src="require('../assets/img/password-visible.svg')"/>
                        </div>
                    </div>
                    <div class="form-error" v-if="values.passwordRepeat.error">
                        <img :src="require('../assets/img/error-icon.svg')"/>
                        {{this.values.passwordRepeat.error}}
                    </div>
                </div>
                <template v-if="signInForm">
                    <div class="login__change-form login__left-padding mt-30" >
                        Don't have an account? 
                        <a href="#" @click.prevent="signInForm=false" class="login__change-form-link"> Log in. </a>
                    </div>
                    <div class="form-error mt-30" v-if="$store.state.authError">
                        <img :src="require('../assets/img/error-icon.svg')"/>
                        {{$store.state.authError}}
                    </div>
                    <div @click="signIn" class="login__button login__button--red mt-30">Sign in</div>
                </template>
                <template v-else>
                    <div class="login__change-form login__left-padding mt-30" >
                        Have an account? 
                        <a href="#" @click.prevent="signInForm=true" class="login__change-form-link"> Sign Up. </a>
                    </div>
                    <div class="form-error mt-30" v-if="$store.state.authError">
                        <img :src="require('../assets/img/error-icon.svg')"/>
                        {{$store.state.authError}}
                    </div>
                    <div @click="signUp" class="login__button login__button--red mt-30">Continue</div>
                </template>


                <button class="login__button login__button--google mt-30" @click="signInWithGoogle">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="LgbsSe-Bz112c"><g><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></g></svg>
                    Log in with google account
                </button>
            </div>
        </div>
        <div class="login" v-if="step===2">
            <div class="login__wrapper">
                <UserDataSettings @close="$router.push('/')"></UserDataSettings>
            </div>
        </div>
    </div>
</template>
<script>
import UserDataSettings from '@/components/UserDataSettings.vue'
export default {
  components: { UserDataSettings },
    data(){
        return{
            signInForm:false,
            passwordVisible:false,
            passwordRepeatVisible:false,
            loginSuccess: false,
            step:1,
            values:{
                email:{
                    value:null,
                    error:null
                },
                password:{
                    value:null,
                    error:null,
                    symbolsVisible:false
                },
                passwordRepeat:{
                    value:null,
                    error:null,
                    symbolsVisible:false
                },
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
        validateEmail() {
            if(!this.values.email.value || !this.values.email.value.length){
                this.values.email.error="Required field."
                return false
            }
            var re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/; 
            let res = re.test(String(this.values.email.value).toLowerCase());
            if(!res){
                this.values.email.error="Is not a valid email address."
            }
            return res 
        },
      
        resetErrors(){
            Object.keys(this.values).forEach(key=>{
                this.values[key].error=null
            })
        },
    
        signInWithGoogle(){
            this.$store.dispatch('signInWithGoogle').then(res=>{
                if(res.noUserData){
                    this.step=2
                }else{
                    this.$router.push('/')
                }
            }).catch(err=>{console.log(err);})
        },


        signUp(){
            this.resetErrors()

            let isError=false
            if(!this.validateEmail()){
                isError=true
            }
            if(!this.values.password.value || this.values.password.value.length===0){
                this.values.password.error="Required field."
                isError=true
            }
            if(this.values.password.value!==this.values.passwordRepeat.value){
                this.values.password.error="Please make sure your passwords match."
                isError=true
            }
            if(isError){
                return
            }
            this.$store.dispatch('signUpWithPassword',{email:this.values.email.value, password:this.values.password.value})
            .then(res=>{
                if(res.success){
                    this.step=2
                }
            }).catch(err=>{console.log(err);})

            // this.step=2
        },


        signIn(){
            this.resetErrors()
            let isError=false
            if(!this.validateEmail()){
                isError=true
            }
            if(!this.values.password.value || this.values.password.value.length===0){
                this.values.password.error="Required field."
                isError=true
            }
         
            if(isError){
                return
            }
            this.$store.dispatch('signInWithPassword',{email:this.values.email.value, password:this.values.password.value})
            .then(res=>{
                if(res.success){
                    this.$router.push('/')
                }
            })
          
        },
    }
}
</script>