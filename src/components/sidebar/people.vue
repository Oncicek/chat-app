<template>
  <div>
    <table>
      <tbody>
        <tr>
          <td>
            <i
              class="bi-circle"
              style="font-size: 2rem; color: cornflowerblue"
            ></i>
          </td>
          <td class="align-middle displayName">
            {{ person.displayName }}
          </td>
          <td>
            <select
              name="peopleDD"
              @click="peopleBtn($event)"
              class="form-select form-control"
            >
              <option>...</option>
              <option value="0">Add to Favorites</option>
              <option value="1">Remove from People</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { reactive, onMounted, ref, inject } from 'vue'

export default {
  props: {
    person: {
      type: Object,
      required: true,
    },
  },

  setup(props: any) {
    const emitter: any = inject('emitter')

    const state = reactive({
      userId: props.person['id'],
    })

    const peopleBtn = (event: any) => {
      if (event.target.value == 0) {
        emitter.emit('favFromPeople', state.userId)
      } else {
        emitter.emit('destroyFromPeople', state.userId)
      }
      console.log(event.target.value)
    }

    return {
      props,
      peopleBtn,
      state,
    }
  },
}
</script>

<style lang="scss" scoped>
.displayName {
  padding-left: 10px;
}
</style>
