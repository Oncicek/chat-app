<template>
  <div class="dropdown-container">
    <button
      class="dd-button"
      type="button"
      id="dropdown-menu-button"
      data-bs-toggle="dropdown"
    >
      ...
    </button>
    <ul
      class="dropdown-menu"
      aria-labelledby="dropdown-menu-button"
      role="menu"
    >
      <li v-for="option in options" :key="option.id">
        <a class="dropdown-item" @click="dropdownClick(option.id)">{{
          option.value
        }}</a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { reactive, onMounted, ref, inject } from 'vue'

export default {
  props: {
    options: {
      type: Array,
      required: true,
    },
    userId: {
      type: Number,
      required: true,
    },
  },

  setup(props: any) {
    const emitter: any = inject('emitter')
    const options: any = ref(props.options)

    const state = reactive({
      options: options.value,
    })

    const dropdownClick = (optionId: number) => {
      if (optionId === 0) {
        emitter.emit('fav-from-people', props.userId)
      } else {
        emitter.emit('destroy-from-people', props.userId)
      }
    }

    onMounted(() => {})

    return {
      props,
      state,
      dropdownClick,
    }
  },
}
</script>

<style lang="scss" scoped>
.dd-button {
  border-radius: 250px;
  width: 28px;
  float: right;
  background-color: lightgray;
  font-weight: bold;
  font-size: 18px;
  border: 0;
}

.dropdown-menu {
  border-radius: 20px;
}

.dropdown-menu > li:first-child > a:hover {
  border-radius: 20px 20px 2px 2px;
}

.dropdown-menu > li:last-child > a:hover {
  border-radius: 2px 2px 20px 20px;
}

.dropdown-item:hover {
  background-color: dodgerblue;
  color: white;
}
</style>
