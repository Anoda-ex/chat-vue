<template>
	<div class="chat__rooms-container chat-app-border-r">
		<div class="sidebar__header">
			<div class="sidebar__header-menu">
				<Menu iconType="menu">
					<div class="menu__list">
						<div @click=" chatSettingsPopup.show = true;  chatSettingsPopup.type = 'group'; ">
							<div class="menu__item">Create chat</div>
						</div>
						<!-- <div @click=" chatSettingsPopup.show = true; chatSettingsPopup.type = 'channel'; ">
							<div class="menu__item">Create channel</div>
						</div> -->
						<div @click="userDataSettingsPopup.show = true">
							<div class="menu__item">Settings</div>
						</div>
						<div @click="contactsPopup.show = true">
							<div class="menu__item">Contacts</div>
						</div>
						<div @click="logoutPopup.show = true">
							<div class="menu__item">Logout</div>
						</div>
						<!-- <div>
							<div class="menu__item">Delete Room</div>
						</div> -->
					</div>
				</Menu>
			</div>
			<div class="search">
				<div class="search__icon">
					<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24">
						<path id="search__icon" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"></path>
					</svg>
				</div>
				<input class="search__input" v-model="search" type="text" placeholder="Search" autocomplete="off" />
			</div>
		</div>
		<div id="rooms-list" class="room__list">
			<div v-if="sidebarItems.length===0 && ( search ? $store.state.searchedItemsLoaded : true)" class="no-found-alert">
				{{search ? 'Not found':'No chats added'}}
			</div>
			<SidebarListItem v-for="item in sidebarItems" :key="item.cid" :item="item"></SidebarListItem>
		</div>
		<ConfirmPopup v-if="logoutPopup.show" @confirm="logoutPopupConfirm" @close="logoutPopupClose" @cancel="logoutPopupClose"></ConfirmPopup>
		<UserDataSettingsPopup v-if="userDataSettingsPopup.show" @close="userDataSettingsPopupClose"></UserDataSettingsPopup>
		<ChatSettingsPopup v-if="chatSettingsPopup.show" :type="chatSettingsPopup.type" @close="chatSettingsPopupClose"></ChatSettingsPopup>
		<ContactsPopup v-if="contactsPopup.show" @close="contactsPopupClose"></ContactsPopup>
	</div>
</template>
<script>
	import Menu from "./Menu.vue";
	import ConfirmPopup from "./Popups/ConfirmPopup.vue";
	import UserDataSettingsPopup from "./Popups/UserDataSettingsPopup.vue";
	import ChatSettingsPopup from "./Popups/ChatSettingsPopup.vue";
	import ContactsPopup from "./Popups/ContactsPopup.vue";
	import SidebarListItem from "./SidebarListItem.vue";
	export default {
		components: {
			Menu,
			ConfirmPopup,
			UserDataSettingsPopup,
			ChatSettingsPopup,
			SidebarListItem,
			ContactsPopup,
		},
		watch:{
			search(newValue){
				if(newValue){
					console.log(newValue);
					this.$store.dispatch('search', {searchValue:newValue})
				}else{
					this.$store.commit('setSearchedItemsToNull')
				}
			},
		},
		data() {
			return {
				search:null,

				logoutPopup: {
					show: false,
				},
				userDataSettingsPopup: {
					show: false,
				},
				chatSettingsPopup: {
					show: false,
					type: null,
					// type:''  channel\group\contact
				},
				contactsPopup: {
					show: false,
				},
			};
		},
		methods: {
			logoutPopupClose() {
				this.logoutPopup.show = false;
			},
			logoutPopupConfirm() {
				this.$store.dispatch("signOut");
				this.logoutPopup.show = false;
			},
			userDataSettingsPopupClose() {
				this.userDataSettingsPopup.show = false;
			},
			chatSettingsPopupClose() {
				this.chatSettingsPopup.show = false;
				this.chatSettingsPopup.type = null;
			},
			contactsPopupClose() {
				this.contactsPopup.show = false;
			},
		},
		computed: {
			sidebarItems(){
				if(this.search){
					// return this.$store.state.searchedItems
					return this.$store.getters.searchedItems
				}else{
					return this.$store.getters.chatsDataList
				}
			}
		},
	};
</script>