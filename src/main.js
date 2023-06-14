import Vue from 'vue'
import App from './App.vue'
import i18n from './i18n'
import Buefy from 'buefy'
// import 'buefy/dist/buefy.css'
import './styles/app.css'
import './style.scss'
import router from './router'
import store from './store'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
Vue.use(Buefy)

const app = new Vue({
  render: (h) => h(App),
  i18n,
  router,
  store
})

app.$mount('#app')
