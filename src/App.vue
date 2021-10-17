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
        <chat :user="'Ahoj'" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import Sidebar from './components/sidebar.vue'
import Conversations from './components/conversations.vue'
import Chat from './components/chat.vue'
import { reactive, onMounted, ref } from 'vue'

export default {
  components: { Chat, Sidebar, Conversations },
  setup() {}
}
</script>

<style lang="scss"></style>
