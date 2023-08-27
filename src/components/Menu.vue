<template>
    <!-- <div class="menu" ref="menu" v-click-outside="(event)=>{iconType==='sidebarItem'&&!timeout ? isOpened=false : null}"> -->
    <div class="menu" ref="menu" >
        <div v-if="iconType==='menu'"  class="chat__svg-button chat__room-options">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24"><path id="chat-icon-menu" d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"></path></svg>
        </div>
        <!--<div v-if="iconType==='sidebarItem'" @click="isOpened=true" class="chat__svg-button room__options" >
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24"> <path id="chat-icon-dropdown-room" d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" ></path> </svg>
        </div> -->
        <div v-show="isOpened" ref="menuOptions" class="menu__options" :class="{'menu__options--opened':isOpened}">
            <slot></slot>
        </div>
    </div>
</template>
<script>
export default {
    props:['iconType'],
    data(){
        return{
            isOpened:false,
            timeout:null,
            closestElement:null
        }
    },
    watch:{
        isOpened(value){
            if(!value){
                clearTimeout(this.timeout);
                this.timeout=null;
            }
        }
    },
    methods:{
        test(test){
            console.log(test);
        },
        toggleMenu(event){
            event.preventDefault()
            this.isOpened = !this.isOpened;
            // if(this.isOpened&&this.iconType==='menu'){
            //     this.timeout=true
            // }
        },
        startMouseEvent(event){
            this.timeout = setTimeout(()=>{
                this.isOpened=true;
            }, 1000)
        },
        finishMouseEvent(event){
            
            clearTimeout(this.timeout);
            this.timeout=null;
         
        },
        hideMenu(event){
            if(this.iconType==='menu'&&event.target.classList.contains('menu__item')){
                return
            }
            console.log('hide menu');
            if(!this.timeout){
                this.isOpened=false
                return
            }
        },
        stopPropagation(event){
            console.log('stopPropagation');
            event.stopPropagation()
        },
        menuItemClick(event){
            console.log('menuItemClick');

            clearTimeout(this.timeout);
            this.timeout=null;
            this.isOpened=false
            
        }
    },  
    mounted(){
            
    
        if(this.iconType==='menu'){
            this.$refs.menu.addEventListener('click', this.toggleMenu)
            this.$refs.menu.addEventListener('click', this.stopPropagation)
        }else if(this.iconType==='sidebarItem'){
            this.closestElement = this.$refs.menu.closest('.menu-event-area')
            if(this.closestElement){
                this.closestElement.addEventListener('mousedown', this.startMouseEvent)
                this.closestElement.addEventListener('mouseup', this.finishMouseEvent)
                this.closestElement.addEventListener('touchstart', this.startMouseEvent)
                this.closestElement.addEventListener('touchend', this.finishMouseEvent)
            }
        }
        this.$refs.menuOptions.querySelectorAll('.menu__item').forEach(element=>{
            console.log('menu__item click');
            element.addEventListener('click', this.menuItemClick);
        })
        this.$refs.menuOptions.addEventListener('click', this.stopPropagation)
        window.addEventListener('mousedown', this.hideMenu)
        window.addEventListener('touchstart', this.hideMenu)
    }
}
</script>