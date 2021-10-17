<template>
  <div class="container-flex">
    <div class="row">
      <div class="col">
        <button type="button" class="btn btn-secondary" @click="Login">
          Login
        </button>
        <button type="button" class="btn btn-secondary" @click="Logout">
          Logout
        </button>
        <button type="button" class="btn btn-primary" @click="ShowEditComp">
          Edit
        </button>
        <form class="login-form" @submit.prevent="Login">
          <div class="form-inner">
            <label for="username">Username</label>
            <input type="text" v-model="inputUserName" />
            <label v-if="isLogged" for="username"> {{ infoTab }} </label>
          </div>
        </form>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <button>Converations</button>
      </div>
    </div>
    <div class="row">
      <favorites />
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, onMounted, ref, inject, watch } from 'vue'
import Favorites from './sidebar/favorites.vue'

export default {
  components: { Favorites },
  setup() {
    const emitter: any = inject('emitter')
    const inputUserName = ref('')

    let isLogged = ref(false)
    let infoTab = ref('')

    const Login = () => {
      if (!inputUserName.value) return
      if (isLogged.value) {
        infoTab.value = 'Please logout first'
        return
      } else {
        infoTab.value = ''
      }
      isLogged.value = true
      emitter.emit('Login', inputUserName.value)
    }

    const Logout = () => {
      if (!isLogged) return
      isLogged.value = false
      inputUserName.value = ''
      emitter.emit('Logout', isLogged.value)
    }

    const ShowEditComp = () => {
      emitter.emit('ShowEditComp')
    }

    onMounted(() => {})

    return {
      Login,
      Logout,
      inputUserName,
      isLogged,
      ShowEditComp,
      infoTab,
    }
  },
}
</script>
<style scoped lang="scss"></style>
