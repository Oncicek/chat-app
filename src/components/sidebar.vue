<template>
  <div class="container-flex">
    <div class="row">
      <div class="col">
        <div class="row">
          <div class="col">
            <header>{{ userNameOrig }}</header>
          </div>
          <div class="col">
            <button type="button" class="btn btn-primary" @click="ShowEditComp">
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <header>Favorites</header>
      <favorites
        v-for="favoritePerson in favoritePeople"
        :key="favoritePerson.id"
        :favoritePerson="favoritePerson"
      />
    </div>
    <div class="row">
      <people
        v-for="person in people"
        :key="person.id"
        :person="person"
        @click="getChat(person.id, person.displayName)"
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

    let userName = ref(props.userName)
    let isLogged = ref('')
    let infoTab = ref('')

    const getChat = (id: number, chatName: string) => {
      emitter.emit('getChat', { id, chatName })
    }

    const ShowEditComp = () => {
      emitter.emit('ShowEditComp')
    }

    const SwitchHeader = () => {
      if (!userName.value) {
        return props.userNameOrig
      } else {
        return userName.value
      }
    }

    onMounted(() => {})

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
    }
  },
}
</script>
<style scoped lang="scss"></style>
