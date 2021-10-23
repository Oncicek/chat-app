<template>
  <div class="container">
    <div class="row">
      <div class="col sidebarTheme">
        <sidebar :people="peopleData" />
      </div>
      <div class="col" v-if="isEditing">
        <edit :people="peopleData" />
      </div>
      <div class="col" v-if="!isEditing && userNameId">
        <chat
          :userName="userName"
          :userNameId="userNameId"
          :chatNameId="chatNameId"
        />
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
import axios from 'axios'

export default {
  components: { Chat, Sidebar, Conversations, Edit },
  setup() {
    const emitter: any = inject('emitter')
    const peopleData: any = ref([])
    let isEditing = ref(false)
    let userName = ref('')
    let userNameId = ref(0)

    const FetchUsersData = async () => {
      const response: any = await axios.get('../people.json')
      peopleData.value = response.data

      console.log(peopleData.value)
    }

    emitter.on('ShowEditComp', () => {
      ShowEditComp()
    })

    const ShowEditComp = () => {
      isEditing.value = !isEditing.value
    }

    const UpdateUserData = (id: number) => {
      peopleData.value.forEach((x: any) => {
        if (x.id == id) {
          x.active = true
        } else {
          x.active = false
        }
      })

      if (peopleData.value) {
        userNameId.value = peopleData.value.find(
          (x: any) => x.active === true
        )?.id

        userName.value = peopleData.value.find(
          (x: any) => x.active === true
        )?.displayName
      }
    }

    onMounted(() => {
      FetchUsersData()

      if (peopleData.value) {
        userNameId.value = peopleData.value.find(
          (x: any) => x.active === true
        )?.id

        userName.value = peopleData.value.find(
          (x: any) => x.active === true
        )?.displayName
      }

      emitter.on('updateUser', (id: number) => {
        UpdateUserData(id)
      })
    })

    return {
      ShowEditComp,
      isEditing,
      userNameId,
      userName,
      FetchUsersData,
      peopleData,
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

.sidebarTheme {
  background-color: lavenderblush;
}
</style>
