<template>
  <div class="container edit-container">
    <div class="row">
      <header><strong>Preferences</strong></header>
    </div>
    <hr />
    <div class="row name-part">
      <div class="col-3">
        <p>Name</p>
      </div>
      <div class="col-2 single-name">
        <strong>{{ user.displayName }}</strong>
      </div>
      <div class="col-4">
        <p>{{ '(' + user.fullName + ')' }}</p>
      </div>
      <div class="col-3">
        <button class="btn btn-outline-dark" @click="onEditClick">Edit</button>
      </div>
    </div>
    <hr />
    <div class="row">
      <header class="sub-header">Appearance</header>
      <div class="col-2 appearance-part">
        <p>Theme</p>
      </div>
      <div class="col">
        <div class="btn-group" role="group" aria-label="Basic example">
          <button
            type="button"
            class="btn btn-light"
            @click="nah($event)"
            value="System"
          >
            System
          </button>
          <button
            type="button"
            class="btn btn-light"
            value="Light"
            @click="nah($event)"
          >
            Light
          </button>
          <button
            type="button"
            class="btn btn-light"
            value="Dark"
            @click="nah($event)"
          >
            Dark
          </button>
        </div>
      </div>
    </div>
    <div class="row last-row-appearance">
      <div class="col-2">
        <label class="switch">
          <input
            type="checkbox"
            v-model="state.isShowFavs"
            @click="showFavs(event)"
          />
          <span class="slider round"></span>
        </label>
      </div>
      <div class="col">
        <span>Show favorites in sidebar</span>
      </div>
    </div>
    <hr />
    <div class="row">
      <header class="sub-header">Debug</header>

      <div class="col-6">
        <p>Active user</p>
      </div>
      <div class="col-5">
        <select class="form-select" v-model="selectedUser" @change="updateUser">
          <option v-for="person in people" :key="person.id" :value="person.id">
            {{ person.fullName }}
          </option>
        </select>
      </div>
      <div class="row config-wrapper">
        <div class="col">
          <button class="btn btn-outline-dark" @click="resetConfig">
            Reset Config
          </button>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="alert alert-danger" v-if="state.showAlert">
          {{ state.alertText }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, onMounted, ref, inject, watch } from 'vue'

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
    const user: any = ref([])
    let isShowFavs = ref(true)
    let showAlert = ref(false)
    let showModal = ref(false)
    let alertText = ref('')
    showAlert.value = false

    const state = reactive({
      showAlert: showAlert.value,
      showModal: showModal.value,
      alertText: alertText.value,
      isShowFavs: isShowFavs.value,
    })

    // watch(
    //   () => state.showModal,
    //   () => {
    //     emitter.emit('show-modal', true)
    //   }
    // )

    const onEditClick = () => {
      emitter.emit('show-modal')
    }

    state.showModal

    const nah = (event: any) => {
      state.showAlert = true

      setTimeout(() => {
        state.showAlert = false
      }, 5000)
      state.alertText =
        'Please subscribe to premium version for this feature: ' +
        event.target.value +
        ' theme'
    }

    const findActive = () => {
      user.value = props.people.find((x: any) => x.active === true)
      selectedUser.value = user.value.id
    }

    const updateUser = () => {
      emitter.emit('update-user', selectedUser.value)
    }

    const showFavs = () => {
      emitter.emit('show-favs-edit', state.isShowFavs)
    }

    emitter.on('show-favs-sidebar', (isFavsShown: boolean) => {
      state.isShowFavs = isFavsShown
    })

    const resetConfig = () => {
      emitter.emit('reset-config')
    }

    onMounted(() => {
      findActive()
    })

    return {
      props,
      selectedUser,
      user,
      findActive,
      updateUser,
      state,
      resetConfig,
      nah,
      showFavs,
      onEditClick,
    }
  },
}
</script>
<style lang="scss" scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 25px;
}

.config-wrapper {
  padding-top: 200px;
}

.sub-header {
  padding-bottom: 25px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

p {
  color: gray;
  font-weight: 300;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: '';
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

.edit-container {
  padding-top: 10px;
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.name-part {
  padding: 40px 0px 30px 0px;
}

.single-name {
  text-align: end;
}

.btn {
  padding: 0px 20px !important;
  border-radius: 10px;
  border: lightgray solid 1px;
  font-size: 15px;
  font-weight: bold;
}

.btn-light:focus {
  background-color: white !important;
  outline: 0 !important;
  border: none !important;
}

.alert-danger {
  position: absolute;
  bottom: 15px;
  width: 30%;
  text-align: center;
  border-radius: 15px;
}

.last-row-appearance {
  padding-bottom: 120px;
}

header {
  font-size: 23px;
}
</style>
