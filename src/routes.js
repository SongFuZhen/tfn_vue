import Vue from "vue";
import VueRouter from "vue-router";
import Login from './components/Login.vue'
import SendMsg from './components/SendMsg.vue'

Vue.use(VueRouter);

export default new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Login
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/send_message',
            name: 'send_message',
            component: SendMsg,
            meta: {
                requireAuth: true
            }
        }
    ]
})