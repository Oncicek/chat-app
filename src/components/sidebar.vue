<template>
  <div class="container-flex">
    <div class="row">
      <div class="col">
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
        v-for="person in people"
        :key="person.id"
        :person="person"
        @click="getChat(person.id)"
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
  },
  components: { Favorites, People },
  setup(props: any) {
    const emitter: any = inject('emitter')
    const inputUserName = ref('')

    let isLogged = ref('')
    let infoTab = ref('')

    const getChat = (id: number) => {
      emitter.emit('getChat', id)
    }

    const ShowEditComp = () => {
      emitter.emit('ShowEditComp')
    }

    onMounted(() => {})

    return {
      inputUserName,
      isLogged,
      ShowEditComp,
      infoTab,
      getChat,
    }
  },
}
</script>
<style scoped lang="scss"></style>
