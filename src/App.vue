<template>
  <div class="container" v-if="isLoaded">
    <div class="row">
      <div class="col sidebarTheme">
        <sidebar
          :people="sidebarData"
          :userNameOrig="userName"
          :favoritePeople="favoriteData"
        />
      </div>
      <div class="col" v-if="isEditing">
        <edit :people="peopleData" />
      </div>
      <div class="col" v-if="!isEditing && userNameId > -1">
        <chat
          :user="user"
          :chatSide="chatSide"
          :favoritePeople="favoriteData"
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
import { reactive, onMounted, ref, inject, onUnmounted } from 'vue'
import axios from 'axios'

export default {
  components: { Chat, Sidebar, Conversations, Edit },
  setup() {
    const emitter: any = inject('emitter')
    const peopleData: any = ref([])
    let isEditing = ref(false)
    let userName = ref('')
    let userNameId = ref(0)
    const user: any = ref([])
    let isLoaded = ref(false)
    const sidebarData: any = ref([])
    const favoriteData: any = ref([])
    const myFavorites: any = ref([])
    const chatSide: any = ref([])

    const FetchUsersData = async () => {
      const response: any = await axios.get('../people.json')

      if (response.status === 200) {
        peopleData.value = response.data

        GetSidebarData(peopleData.value)
        GetUserData(peopleData.value)
        GetFavoriteData(peopleData.value)

        isLoaded.value = true
      }
    }

    const GetSidebarData = (originalData: any) => {
      sidebarData.value = originalData.filter((x: any) => x.active === false)

      GetFirstChat(sidebarData.value)
    }

    const GetUserData = (originalData: any) => {
      user.value = originalData.find((x: any) => x.active === true)

      userNameId.value = parseInt(user.value.id)
      userName.value = user.value.displayName
      myFavorites.value = user.value.myFavorites
    }

    const GetFavoriteData = (originalData: any) => {
      let userFavorite: [] = user.value['myFavorites']

      userFavorite.forEach((x: number) => {
        favoriteData.value.push(
          originalData.find((y: any) => parseInt(y.id) === x)
        )
      })
    }

    emitter.on('ShowEditComp', () => {
      ShowEditComp()
    })

    const ShowEditComp = () => {
      isEditing.value = !isEditing.value
    }

    const GetFirstChat = (originalData: any) => {
      chatSide.value = originalData[0]
      console.log(chatSide.value)
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
        GetUserData(peopleData.value)

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

    onUnmounted(() => {
      emitter.off('updateUser')
    })

    return {
      ShowEditComp,
      isEditing,
      userNameId,
      userName,
      FetchUsersData,
      peopleData,
      sidebarData,
      favoriteData,
      GetSidebarData,
      GetFavoriteData,
      chatSide,
      user,
      isLoaded,
      GetFirstChat,
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
