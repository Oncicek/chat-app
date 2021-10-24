<template>
  <div class="container">
    <header>Favorites</header>
    <div class="row">
      <div class="col-1">
        <i class="bi-alarm" style="font-size: 2rem; color: cornflowerblue"></i>
      </div>
      <div class="col-10">
        <div>{{ favoritePerson.displayName }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, onMounted, ref } from 'vue'

export default {
  props: {
    favoritePerson: {
      type: Object,
      required: true,
    },
  },

  setup(props: any) {
    console.log(props)

    return {
      props,
    }
  },
}
</script>

<style lang="scss" scoped></style>
