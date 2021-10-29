<template>
  <div class="container">
    <div class="row">
      <div class="col-1">
        <div class="circle">
          {{ personInfo.nameInitials }}
        </div>
      </div>
      <div class="col-11 fav-content">
        <div class="name">{{ favoritePerson.displayName }}</div>
        <div v-if="state" class="content">{{ state.lastMessage }}</div>
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

      emitter.on('fav-message', (favMessage: any) => {
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
      emitter.off('fav-message')
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
  color: #fff;
  font-weight: bold;
  text-align: center;
  background: rgb(150, 150, 150);
  border: 0px;
  padding-top: 8px;
}

.fav-content {
  padding-left: 25px;
  line-height: normal;
}

.name {
  font-weight: bold;
}

.content {
  color: rgb(150, 150, 150);
}
</style>
