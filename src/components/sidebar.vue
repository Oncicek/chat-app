<template>
  <div class="view login">
    <button type="button" class="btn btn-secondary" @click="Login">
      Login
    </button>
    <button type="button" class="btn btn-secondary" @click="Logout">
      Logout
    </button>
    <form class="login-form" @submit.prevent="Login">
      <div class="form-inner">
        <label for="username">Username</label>
        <input type="text" v-model="inputUserName" />
        <label v-if="!isLogged" for="username"> Please logout first </label>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { reactive, onMounted, ref, inject } from 'vue'

export default {
  setup() {
    const emitter: any = inject('emitter')
    const inputUserName = ref('')

    let isLogged = ref(false)

    const Login = () => {
      if (!inputUserName.value) return
      isLogged.value = true
      emitter.emit('Login', inputUserName.value)
    }

    const Logout = () => {
      if (!isLogged) return
      isLogged.value = false
      emitter.emit('Logout')
    }

    onMounted(() => {})

    return {
      Login,
      Logout,
      inputUserName,
      isLogged,
    }
  },
}
</script>
<style scoped lang="scss"></style>
