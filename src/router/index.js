import Vue from 'vue'
import MainLayout from '../views/MainLayout.vue'
import Login from '../views/Login.vue'
import { createRouter,createWebHistory} from 'vue-router'
import store from '../store/index.js'
// import HomeView from '../views/HomeView.vue'

// Vue.use(VueRouter)

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/',
        name: 'MainLayout',
        meta: { requiresAuth: true },
        component: MainLayout
    },

]

const router = createRouter({
  history: createWebHistory(),
  routes, // short for `routes: routes`
})

router.beforeEach((to, from, next) => {
    if (!store.getters.isLoggedIn && to.matched.some((route) => route.meta?.requiresAuth)) {
        next("/login");
    } else {
        if(to.name){
            next()
        }else{
            next('/');
        }
    }
  });
export default router
