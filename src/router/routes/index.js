import home from 'src/views/home.vue'
import admin from 'src/views/admin.vue'

const routes = [{
  // catch-all to redirect to home view if no route matched
  path: '*',
  redirect: '/home'
}, {
  name: 'Home',
  path: '/home',
  component: home
}, {
  name: 'Admin',
  path: '/admin',
  component: admin
}]

export default routes
