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
    <div class="row">
      <div class="col">
        <label class="switch">
          <input type="checkbox" @click="showFavs(event)" />
          <span class="slider round"></span>
        </label>
      </div>
      <div class="col">
        <span>Show / hide favorites</span>
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
        <button @click="resetConfig">Reset Config</button>
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
    let isShowFavs = ref(true)

    const state = reactive({
      showModal: false,
      isShowFavs: isShowFavs.value,
    })

    const findActive = () => {
      selectedUser.value = props.people.find((x: any) => x.active === true).id
    }

    const updateUser = () => {
      emitter.emit('updateUser', selectedUser.value)
    }

    const showFavs = (isShown: boolean) => {
      emitter.emit('toggleFavs', isShown)
    }

    const resetConfig = () => {
      emitter.emit('resetConfig')
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
      resetConfig,
      showFavs,
    }
  },
}
</script>
<style lang="scss" scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
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
  height: 26px;
  width: 26px;
  left: 4px;
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

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
