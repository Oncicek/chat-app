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
    let myFavoriteManuallyAdded = ref(-1)
    const user: any = ref([])
    let isLoaded = ref(false)
    const sidebarData: any = ref([])
    const favoriteData: any = ref([])
    let userFavorite: any = ref([])
    let manAdded: any = ref([])
    const chatSide: any = ref([])
    let userFromFav = ref(-1)

    const FetchUsersData = async () => {
      if (CachedData()) {
        ShowData(peopleData.value)
        isLoaded.value = true
        return
      }

      const response: any = await axios.get('../people.json')

      if (response.status === 200) {
        peopleData.value = response.data
        localStorage.setItem('fakeApi', JSON.stringify(peopleData.value))

        ShowData(peopleData.value)

        isLoaded.value = true
      }
    }

    const ShowData = (data: any) => {
      GetUserData(data)
      GetSidebarData(data)
      GetFavoriteData(data)
    }

    const state = reactive({
      manAdded: manAdded.value,
      userFromFav: userFromFav.value,
    })

    const GetSidebarData = (originalData: any) => {
      sidebarData.value = originalData.filter((x: any) => x.active === false)

      GetFirstChat(sidebarData.value)
    }

    const GetUserData = (originalData: any) => {
      user.value = originalData.find((x: any) => x.active === true)

      userNameId.value = parseInt(user.value.id)
      userName.value = user.value.displayName
    }

    const GetFavoriteData = (originalData: any) => {
      originalData.forEach((x: any) => {
        if (x.id === state.userFromFav) {
          for (let i = 0; i < state.manAdded.length; i++) {
            if (x.myFavorites.indexOf(parseInt(state.manAdded[i])) === -1) {
              x.myFavorites.push(parseInt(state.manAdded[i]))
            }
          }
        }
      })

      favoriteData.value = []
      userFavorite.value = user.value['myFavorites']

      userFavorite.value.forEach((x: number) => {
        favoriteData.value.push(
          originalData.find((y: any) => parseInt(y.id) === x)
        )
      })

      console.log('manAdded: ', state.manAdded)
      console.log('userFavorite: ', userFavorite.value)
      console.log('favoriteData: ', favoriteData.value)
    }

    emitter.on('ShowEditComp', (isFromRow: boolean) => {
      ShowEditComp(isFromRow)
    })

    emitter.on('updateUser', (id: number) => {
      UpdateUserData(id)
    })

    const ShowEditComp = (isFromRow: boolean) => {
      if (isFromRow) {
        isEditing.value = !isFromRow
      } else {
        isEditing.value = !isEditing.value
      }
    }

    const GetFirstChat = (originalData: any) => {
      chatSide.value = originalData[0]
    }

    const UpdateFavorites = (params: any) => {
      let chatId = parseInt(params.chatId)
      let userId = parseInt(params.userId)

      peopleData.value.forEach((x: any) => {
        if (parseInt(x.id) === userId) {
          let indexInFavs = x.myFavorites.indexOf(chatId)
          let indexInPeople = favoriteData.value.findIndex(
            (y: any) => parseInt(y.id) == chatId
          )
          if (parseInt(indexInFavs) === -1) {
            x.myFavorites.push(chatId)
            favoriteData.value.push(
              peopleData.value.find(
                (person: any) => parseInt(person.id) == chatId
              )
            )
          } else {
            x.myFavorites.splice(indexInFavs, 1)
            favoriteData.value.splice(indexInPeople, 1)
          }
          console.log(x.myFavorites)
        }
      })

      localStorage.setItem('fakeApi', JSON.stringify(peopleData.value))
    }

    const CachedData = () => {
      if (localStorage.getItem('fakeApi')) {
        peopleData.value = JSON.parse(localStorage.getItem('fakeApi')!) || []
        return true
      } else {
        localStorage.setItem('fakeApi', JSON.stringify(peopleData.value))
        return false
      }
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
        GetFavoriteData(peopleData.value)

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
        state.manAdded = []
        UpdateUserData(id)
      })

      emitter.on('addToFavorites', (params: any) => {
        UpdateFavorites(params)
      })
    })

    onUnmounted(() => {
      emitter.off('updateUser')
      emitter.off('addToFavorites')
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
      userFavorite,
      myFavoriteManuallyAdded,
      user,
      state,
      isLoaded,
      GetFirstChat,
      UpdateFavorites,
      CachedData,
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
