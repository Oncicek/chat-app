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

      <div
        class="modal fade"
        id="exampleModal"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        v-if="state.showModal"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">...</div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button type="button" class="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
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
        <select v-model="selectedUser" @click="updateUser">
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
