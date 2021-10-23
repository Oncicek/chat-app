<template>
  <div class="container">
    <div class="row">
      <div class="col sidebarTheme">
        <sidebar :people="sidebarData" :userNameOrig="userName" />
      </div>
      <div class="col" v-if="isEditing">
        <edit :people="peopleData" />
      </div>
      <div class="col" v-if="!isEditing && userNameId > -1">
        <chat
          :userName="userName"
          :userNameId="userNameId"
          :chatNameOrig="chatName"
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
    const sidebarData: any = ref([])
    const chatName: any = ref('')

    const FetchUsersData = async () => {
      const response: any = await axios.get('../people.json')
      peopleData.value = response.data

      GetSidebarData(peopleData.value)

      userNameId.value = parseInt(
        peopleData.value.find((x: any) => x.active === true).id
      )
      userName.value = peopleData.value.find(
        (x: any) => x.active === true
      ).displayName
    }

    const GetSidebarData = (originalData: any) => {
      sidebarData.value = originalData.filter((x: any) => x.active === false)

      GetChatName(sidebarData.value)
    }

    emitter.on('ShowEditComp', () => {
      ShowEditComp()
    })

    const ShowEditComp = () => {
      isEditing.value = !isEditing.value
    }

    const GetChatName = (sidebarData: any) => {
      chatName.value = sidebarData.find(
        (x: any) => x.active === false
      ).displayName
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
        userNameId.value = parseInt(
          peopleData.value.find((x: any) => x.active === true)?.id
        )

        GetSidebarData(peopleData.value)

        sidebarData.value = peopleData.value.filter(
          (x: any) => x.active === false
        )

        userName.value = peopleData.value.find(
          (x: any) => x.active === true
        )?.displayName
      }
    }

    onMounted(() => {
      FetchUsersData()

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
      sidebarData,
      GetSidebarData,
      GetChatName,
      chatName,
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
