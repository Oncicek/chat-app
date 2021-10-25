<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <p>Name</p>
      </div>
      <div class="col">
        <p>Laszlo</p>
      </div>
      <div class="col">
        <button @click="!state.showModal">Edit</button>
      </div>
    </div>
    <hr />
    <div class="row">
      <header>Appearance</header>
      <div class="col">
        <p>Theme</p>
      </div>
      <div class="col">
        <button>System</button>
        <button>Light</button>
        <button>Dark</button>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <button>Click</button>
      </div>
      <div class="col">
        <p>Show favorites in sidebar</p>
      </div>
    </div>
    <hr />
    <div class="row">
      <header>Debug</header>
      <div class="col">
        <p>Active user</p>
      </div>
      <div class="col">
        <select v-model="selectedUser" @change="updateUser">
          <option v-for="person in people" :key="person.id" :value="person.id">
            {{ person.displayName }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, onMounted, ref, inject } from 'vue'

export default {
  props: {
    people: {
      type: Object,
      required: true,
    },
  },

  setup(props: any) {
    const emitter: any = inject('emitter')
    const selectedUser = ref(-1)

    const state = reactive({
      showModal: false,
    })

    const findActive = () => {
      selectedUser.value = props.people.find((x: any) => x.active === true).id
    }

    const updateUser = () => {
      emitter.emit('updateUser', selectedUser.value)
    }

    const showModal = () => {
      state.showModal
    }

    onMounted(() => {
      state.showModal = false
      findActive()
    })

    return {
      props,
      selectedUser,
      findActive,
      updateUser,
      state,
    }
  },
}
</script>
