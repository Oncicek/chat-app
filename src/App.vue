<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <sidebar />
      </div>
      <div class="col">
        <conversations />
      </div>
      <div class="col">
        <chat />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Sidebar from './components/sidebar.vue'
import Conversations from './components/conversations.vue'
import Chat from './components/chat.vue'
import { reactive, onMounted, ref } from 'vue'

export default {
  components: { Chat, Sidebar, Conversations },
  setup() {},
}
</script>

<style lang="scss">
* {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
