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
          <div class="col-7 name-header">
            <strong>{{ userNameOrig }}</strong>
          </div>
          <div class="col-2">
            <button type="button" class="circle" @click="showEditComp(false)">
              <strong>{{ personInfo.editNamebtn }}</strong>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <header>Favorites</header>
      </div>
      <div class="col">
        <button
          @click="showFavs"
          class="chevron-btn"
          v-if="!personInfo.isShowFavs"
        >
          <i class="bi-chevron-down"></i>
        </button>
        <button
          @click="showFavs"
          class="chevron-btn"
          v-if="personInfo.isShowFavs"
        >
          <i class="bi-chevron-up"></i>
        </button>
      </div>
      <favorites-component
        v-if="personInfo.isShowFavs"
        class="favorite-tab"
        v-for="favoritePerson in favoritePeople"
        :key="favoritePerson.id"
        :favoritePerson="favoritePerson"
        @click="showEditComp(true)"
      />
    </div>
    <div class="row">
      <header class="second-header">People</header>
      <people-component
        class="people-tab"
        v-for="person in people"
        :key="person.id"
        :person="person"
        @click="showEditComp(true)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, onMounted, ref, inject, watch, computed } from 'vue'
import FavoritesComponent from './sidebar/favorites.vue'
import PeopleComponent from './sidebar/people.vue'

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
  components: { FavoritesComponent, PeopleComponent },
  setup(props: any) {
    const emitter: any = inject('emitter')
    const peopleSaved = ref(props.people)

    let userName = ref(props.userName)
    let editNamebtn = ref(props.userName)
    let isShowFavs = ref(true)

    const personInfo = reactive({
      editNamebtn: editNamebtn.value,
      isShowFavs: isShowFavs.value,
    })

    const showEditComp = (isFromRow: boolean) => {
      emitter.emit('show-edit-comp', isFromRow)
    }

    const showFavs = () => {
      personInfo.isShowFavs = !personInfo.isShowFavs
      emitter.emit('show-favs-sidebar', personInfo.isShowFavs)
    }

    const switchHeader = () => {
      if (!userName.value) {
        return props.userNameOrig
      } else {
        return userName.value
      }
    }

    watch(
      () => props.userNameOrig,
      () => {
        getNameInitials(props.userNameOrig)
      }
    )

    emitter.on('show-favs-edit', (isFavsShown: boolean) => {
      personInfo.isShowFavs = !isFavsShown
    })

    const getNameInitials = (fullName: string) => {
      let name = fullName.split(' ')

      if (name.length > 1) {
        personInfo.editNamebtn = name[0].charAt(0) + name[1].charAt(0)
      } else {
        personInfo.editNamebtn = name[0].charAt(0) + name[0].charAt(1)
      }
    }

    onMounted(() => {
      getNameInitials(props.userNameOrig)
    })

    return {
      showEditComp,
      userName,
      switchHeader,
      props,
      peopleSaved,
      personInfo,
      getNameInitials,
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

.people-tab:hover {
  background-color: rgb(231, 229, 229);
}

.people-tab {
  padding-top: 5px;
}

.favorite-tab:hover {
  background-color: rgb(231, 229, 229);
}

.favorite-tab {
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
