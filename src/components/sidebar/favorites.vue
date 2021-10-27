<template>
  <div class="container">
    <div class="row">
      <div class="col-1">
        <div class="circle">
          {{ personInfo.nameInitials }}
        </div>
        <!-- <i class="bi-alarm" style="font-size: 2rem; color: cornflowerblue"></i> -->
      </div>
      <div class="col-10">
        <div>{{ favoritePerson.displayName }}</div>
        <div v-if="state">{{ state.lastMessage }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, onMounted, ref, inject, onUnmounted } from 'vue'

export default {
  props: {
    favoritePerson: {
      type: Object,
      required: true,
    },
  },

  setup(props: any) {
    const emitter: any = inject('emitter')
    let favouriteData: any = ref([])
    let lastMessage: any = ref('')
    let nameInitials = ref(props.favoritePerson.fullName)

    const personInfo = reactive({
      nameInitials: nameInitials.value,
    })
    const state = reactive({
      favoritePerson: props.favoritePerson['displayName'],
      favouriteData: favouriteData,
      lastMessage: lastMessage,
    })

    const GetNameInitials = (fullName: string) => {
      let name = fullName.split(' ')
      personInfo.nameInitials = name[0].charAt(0) + name[1].charAt(0)
    }

    onMounted(() => {
      GetNameInitials(personInfo.nameInitials)

      emitter.on('favMessage', (favMessage: any) => {
        state.favouriteData =
          favMessage.find(
            (x: any) => x.favoritePersonId === props.favoritePerson.id
          ) || ''

        console.log(favMessage)

        if (state.favouriteData.lastMessage) {
          state.lastMessage = state.favouriteData.lastMessage
        }
      })
    })
    onUnmounted(() => {
      emitter.off('favMessage')
    })

    return {
      props,
      state,
      personInfo,
      nameInitials,
      GetNameInitials,
    }
  },
}
</script>

<style lang="scss" scoped>
.circle {
  width: 40px;
  height: 40px;
  border-radius: 250px;
  font-size: 15px;
  color: black;
  font-weight: bold;
  text-align: center;
  background: lightgray;
  border: 0px;
  padding-top: 35%;
}
</style>
