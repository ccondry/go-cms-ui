<template>
  <div class="container is-fluid is-marginless app-content">
    <transition
    mode="out-in"
    enter-active-class="fadeIn"
    leave-active-class="fadeOut"
    appear
    >
      <keep-alive>
        <router-view />
      </keep-alive>
    </transition>
  </div>
</template>

<script>
export default {
  async mounted () {
  }
}
</script>

<style lang="scss">
// import the momentum-ui SASS color variables
// @import '~@momentum-ui/core/scss/colors/settings-base';

</style>
