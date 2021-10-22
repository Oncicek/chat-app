<template>
  <div>
    <table>
      <tbody>
        <tr @click="getChat">
          <td>
            <i
              class="bi-circle"
              style="font-size: 2rem; color: cornflowerblue"
            ></i>
          </td>
          <td class="align-middle displayName">
            {{ person.displayName }}
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
    lastMessage: {
      type: String,
      required: false,
    },
  },

  setup(props: any) {
    return {
      props,
    }
  },
}
</script>

<style lang="scss" scoped>
.displayName {
  padding-left: 10px;
}
</style>
