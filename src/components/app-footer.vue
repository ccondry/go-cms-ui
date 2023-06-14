<template>
  <div class="content" style="display: flex; flex-direction: column; align-items: center;">
    <small> 
      UI Version {{ uiVersion }}
    </small>
    <small>
      API Version {{ apiVersion }}
    </small>
    <small>
      © 2023 Cisco and/or its affiliates. All rights reserved.
    </small>
    <cisco-logo style="width: 4rem; height: 4rem;" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CiscoLogo from 'src/components/cisco-logo.vue'

export default {
  components: {
    CiscoLogo
  },

  computed: {
    ...mapGetters([
      'uiVersion',
      'apiVersion'
    ])
  }
}
</script>