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
    <div class="row">
      <people
        v-for="person in peopleData"
        :key="person.id"
        :person="person"
        @click="getChat(person.displayName)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, onMounted, ref, inject, watch, computed } from 'vue'
import axios from 'axios'
import Favorites from './sidebar/favorites.vue'
import People from './sidebar/people.vue'

export default {
  components: { Favorites, People },
  setup() {
    const emitter: any = inject('emitter')
    const inputUserName = ref('')
    const peopleData = ref([])
    let chatName = ref('')

    let isLogged = ref('')
    let infoTab = ref('')

    const FetchUsersData = async () => {
      const response: any = await axios.get('../people.json')
      peopleData.value = response.data

      console.log(peopleData.value)
    }

    const getChat = (person: string) => {
      chatName.value = person
      emitter.emit('getChat', chatName.value)
      console.log(person)
    }

    const Login = () => {
      if (!inputUserName.value) {
        infoTab.value = 'Please logout first'
        return
      } else {
        infoTab.value = ''
      }

      emitter.emit('Login', inputUserName.value)
    }

    const Logout = () => {
      if (!isLogged) return
      inputUserName.value = ''
      emitter.emit('Logout', inputUserName.value)
    }

    const ShowEditComp = () => {
      emitter.emit('ShowEditComp')
    }

    onMounted(() => {
      FetchUsersData()
    })

    return {
      Login,
      Logout,
      inputUserName,
      isLogged,
      ShowEditComp,
      infoTab,
      FetchUsersData,
      peopleData,
      getChat,
    }
  },
}
</script>
<style scoped lang="scss"></style>
