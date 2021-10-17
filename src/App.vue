<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <sidebar />
      </div>
      <div class="col" v-if="isEditing">
        <edit />
      </div>
      <div class="col" v-if="!isEditing">
        <conversations />
      </div>
      <div class="col" v-if="!isEditing && isLogged">
        <chat />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Sidebar from './components/sidebar.vue'
import Conversations from './components/conversations.vue'
import Chat from './components/chat.vue'
import Edit from './components/edit.vue'
import { reactive, onMounted, ref, inject } from 'vue'

export default {
  components: { Chat, Sidebar, Conversations, Edit },
  setup() {
    const emitter: any = inject('emitter')
    let isEditing = ref(false)
    let isLogged = ref(false)

    emitter.on('ShowEditComp', () => {
      ShowEditComp()
      console.log(isEditing.value)
    })

    const ShowEditComp = () => {
      isEditing.value = !isEditing.value
    }

    onMounted(() => {
      emitter.on('Login', (value: boolean) => {
        isLogged.value = value
      })
      emitter.on('Logout', (value: boolean) => {
        isLogged.value = value
      })
    })

    return {
      ShowEditComp,
      isEditing,
      isLogged,
    }
  },
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
