import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { initializeApp } from 'firebase/app'
export const firebaseApp = initializeApp({
	apiKey: "AIzaSyAehErU_GfuTwD5nE1zEQtaUGsD1SxCmdk",
	authDomain: "chat-vue-df975.firebaseapp.com",
	projectId: "chat-vue-df975",
	storageBucket: "chat-vue-df975.appspot.com",
	messagingSenderId: "901042021817",
	appId: "1:901042021817:web:0f4d9ea44b0cee878d0268"
});

let app = createApp(App)
app.use(router);
app.config.globalProperties.$console = console
import vClickOutside from 'click-outside-vue3'
app.use(vClickOutside)
app.use(store)
app.mount('#app')