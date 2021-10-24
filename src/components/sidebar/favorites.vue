<template>
  <div class="container">
    <div class="row">
      <div class="col-1">
        <i class="bi-alarm" style="font-size: 2rem; color: cornflowerblue"></i>
      </div>
      <div class="col-10">
        <div>{{ favoritePerson.displayName }}</div>
        <div v-if="state">{{ state.lastMessage }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, onMounted, ref, inject } from 'vue'

export default {
  props: {
    favoritePerson: {
      type: Object,
      required: true,
    },
  },

  setup(props: any) {
    console.log(props)

    const emitter: any = inject('emitter')
    let favouriteData: any = ref([])
    let lastMessage: any = ref('')

    emitter.on('favMessage', (favMessage: any) => {
      state.favouriteData =
        favMessage.find(
          (x: any) => x.favoritePersonId === props.favoritePerson.id
        ) || ''

      if (state.favouriteData.lastMessage) {
        state.lastMessage = state.favouriteData.lastMessage
      }
    })

    const state = reactive({
      favoritePerson: props.favoritePerson['displayName'],
      favouriteData: favouriteData,
      lastMessage: lastMessage,
    })

    return {
      props,
      state,
    }
  },
}
</script>

<style lang="scss" scoped></style>
