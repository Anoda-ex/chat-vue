<template>
	<div id="app">
		<div class="flex-center app-loader" v-if="globalLoading">
			<div class="app-loader-container">
				<Loader></Loader>
			</div>
		</div>
		<div v-else>
			<router-view />
		</div>
	</div>
</template>
<script>
import Loader from "./components/Loader.vue"
export default {
	components:{
		Loader
	},
	watch: {
		user(newValue, oldValue) {
			if(!newValue&&oldValue){
				this.$router.push('/login')
			}

		},
		globalLoading(newValue, oldValue){
			console.log('newValue, oldValue',newValue&&!oldValue);
			if(!newValue&&oldValue){
				if(this.$store.getters.isLoggedIn){
					this.$router.push('/')
				}
			}
		}
	},
	computed:{
		user(){
			return this.$store.state.user
		},
		globalLoading(){
			return this.$store.state.globalLoading
		}
	},

	created(){
		this.$store.dispatch('initApp')
		// this.$store.dispatch('googleSignout')	
	}
};
</script>

<style>
</style>
