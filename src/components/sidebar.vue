<template>
  <div class="container-flex">
    <div class="row">
      <div class="col">
        <div class="row first-row">
          <div class="col circles">
            <i class="bi-circle-fill" style="color: red"></i>
            <i class="bi-circle-fill" style="color: orange"></i>
            <i class="bi-circle-fill" style="color: green"></i>
          </div>
          <div class="col-5 name-header">
            <p>{{ userNameOrig }}</p>
          </div>
          <div class="col-1">
            <button type="button" class="circle" @click="ShowEditComp(false)">
              {{ personInfo.editNamebtn }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="row" v-if="personInfo.isShowFavs">
      <div class="col">
        <header>Favorites</header>
      </div>
      <div class="col">
        <button @click="showFavs" class="chevron-btn">
          <i class="bi-chevron-down"></i>
        </button>
      </div>
      <favorites
        class="favoriteTab"
        v-for="favoritePerson in favoritePeople"
        :key="favoritePerson.id"
        :favoritePerson="favoritePerson"
        @click="
          ShowEditComp(true),
            getChat(favoritePerson.id, favoritePerson.displayName)
        "
      />
    </div>
    <div class="row">
      <header class="second-header">People</header>
      <people
        class="peopleTab"
        v-for="person in people"
        :key="person.id"
        :person="person"
        @click="ShowEditComp(true), getChat(person.id, person.displayName)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, onMounted, ref, inject, watch, computed } from 'vue'
import Favorites from './sidebar/favorites.vue'
import People from './sidebar/people.vue'

export default {
  props: {
    people: {
      type: Object,
      required: true,
    },
    favoritePeople: {
      type: Object,
      required: true,
    },
    userNameOrig: {
      type: String,
    },
  },
  components: { Favorites, People },
  setup(props: any) {
    const emitter: any = inject('emitter')
    const inputUserName = ref('')
    const peopleSaved = ref(props.people)
    const favIds = ref([])

    let userName = ref(props.userName)
    let isLogged = ref('')
    let infoTab = ref('')
    let editNamebtn = ref(props.userName)
    let isShowFavs = ref(true)

    const personInfo = reactive({
      editNamebtn: editNamebtn.value,
      isShowFavs: isShowFavs.value,
    })

    const getChat = (id: number, chatName: string) => {
      emitter.emit('getChat', { id, chatName })
    }

    const ShowEditComp = (isFromRow: boolean) => {
      emitter.emit('ShowEditComp', isFromRow)
    }

    const showFavs = () => {
      personInfo.isShowFavs = !personInfo.isShowFavs
    }

    const SwitchHeader = () => {
      if (!userName.value) {
        return props.userNameOrig
      } else {
        return userName.value
      }
    }

    const GetNameInitials = (fullName: string) => {
      let name = fullName.split(' ')
      personInfo.editNamebtn = name[0].charAt(0) + name[1].charAt(0)
    }

    onMounted(() => {
      GetNameInitials(props.userNameOrig)
    })

    return {
      inputUserName,
      isLogged,
      ShowEditComp,
      infoTab,
      getChat,
      userName,
      SwitchHeader,
      props,
      peopleSaved,
      personInfo,
      GetNameInitials,
      showFavs,
    }
  },
}
</script>
<style scoped lang="scss">
header {
  font-size: 30px;
  padding-bottom: 20px;
}

.peopleTab:hover {
  background-color: aqua;
}

.peopleTab {
  padding-top: 5px;
}

.favoriteTab:hover {
  background-color: green;
}

.favoriteTab {
  padding-bottom: 5px;
}

.first-row {
  padding-top: 10px;
}

.name-header {
  padding-top: 3px;
  text-align: right;
  font-size: 20px;
}

.edit-button {
  border-radius: 100px;
  font-size: 15px;
  float: right;
  color: black;
  background-color: lightgray;
}

.name-header-icon {
  display: block;
  size: 100px !important;
}

.circle {
  width: 40px;
  height: 40px;
  border-radius: 250px;
  font-size: 15px;
  color: black;
  font-weight: bold;
  line-height: 0px;
  text-align: center;
  background: lightgray;
  border: 0px;
  float: right;
}

.chevron-btn {
  border: 0px;
  float: right;
  padding-right: 10px;
  font-size: 25px;
}

.second-header {
  padding-top: 40px;
}

.edit-button:focus {
  outline: none !important;
  border: 0px !important;
}

.circles > i {
  padding-left: 5px;
  font-size: 13px;
}
</style>
