import VueRouter from 'vue-router'
import routes from './routes'

const router = new VueRouter({
  mode: 'history',
  linkExactActiveClass: 'is-active',
  scrollBehavior: (to, from, savedPosition) => {
    // same page name?
    if (to.name === from.name) {
      // don't scroll when navigating same page (for example setting query only)
      return
    } else if (savedPosition) {
      // is the browser going back/forward? use the saved scroll position
      return savedPosition
    } else {
      // scroll to top-left when navigating to different page
      return { x: 0, y: 0 }
    }
  },
  routes
})

// copy query parameters on navigation, if they are present
router.beforeEach((to, from, next) => {
  if (!hasQueryParams(to) && hasQueryParams(from)) {
    next({name: to.name, query: from.query})
  } else {
    next()
  }
})

function hasQueryParams (route) {
  return !!Object.keys(route.query).length
}

export default router
