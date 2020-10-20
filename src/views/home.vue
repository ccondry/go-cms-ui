<template>
  <div class="tile is-parent">
    <article
    class="tile is-child notification is-light flex-container box"
    :class="articleClass"
    > 
      <!-- loading/working -->
      <!-- <b-loading :active="true" /> -->

      <!-- title -->
      <p class="title flex-item">
        test
      </p>
      
      <!-- subtitle -->
      <p class="subtitle flex-item">
        test2
      </p>

      <!-- main content -->
      <div class="content flex-item">
        main content
      </div>

      <!-- Name -->
      <b-field label="Name">
        <b-input />
      </b-field>
    </article>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="scss">
</style>
