<template>
    <div class="">
        <div class="form-block">
            <div class="search">
                <div class="search__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24" ><path  id="search__icon" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"></path></svg>
                </div>
                <input class="search__input" v-model="search" type="text" placeholder="Search" autocomplete="off"  />
            </div>
        </div>
        <div v-if="items.length">
            <div class="room__item" v-for="item in itemsFiltered" :key="item.uid">
                <div class="room__container">
                    <div class="chat-avatar">
                        <img :src="item.image" alt=""/>
                    </div>
                    <div class="room__name-containe chat__text-ellipsis flex-justify-between flex-align-center">
                        <div class="room__title-container">
                            <div class="chat__room-name chat__text-ellipsis">
                                {{item.name}}
                            </div>
                        </div>
                        <label class="checkbox-wrapper" v-if="showCheckboxes">
                            <input type="checkbox" :value="item.uid" v-model="selectedUsers" name="prichaty_policy"> 
                            <span class="check"></span> 
                        </label>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="no-found-alert">
            No contacts found
        </div>
        
    </div>
</template>
<script>
export default {
    props:['type', 'items'],
    data(){
        return{
            search:null,
            selectedUsers:[]
        }
    }, 
    watch:{
        selectedUsers(newValue){
            this.$emit('selectedUsersChange', newValue)
        }
    },
    computed:{
      
        itemsFiltered(){
            if(this.search){
                return this.items.filter(item=>{
                    return item.name.includes(this.search)
                })
            }else{
                return this.items
            }
        },
        showCheckboxes(){
            return this.type !== 'show';
        },

    }
}
</script>