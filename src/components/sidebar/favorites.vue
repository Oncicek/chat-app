<template>
  <div
    @click="getChat(favoritePerson.id, favoritePerson.displayName)"
    class="container"
  >
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
import { reactive, onMounted, ref, inject } from 'vue'

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

    const getChat = (id: number, chatName: string) => {
      emitter.emit('get-chat', { id, chatName })
    }

    const state = reactive({
      favoritePerson: props.favoritePerson['displayName'],
      favouriteData: favouriteData,
      lastMessage: lastMessage.value,
    })

    const getNameInitials = (fullName: string) => {
      let name = fullName.split(' ')

      if (name.length > 1) {
        personInfo.nameInitials = name[0].charAt(0) + name[1].charAt(0)
      } else {
        personInfo.nameInitials = name[0].charAt(0) + name[0].charAt(1)
      }
    }

    const getMessage = (favMessage: any) => {
      state.favouriteData =
        favMessage.find(
          (x: any) => x.favoritePersonId === props.favoritePerson.id
        ) || ''

      if (state.favouriteData.lastMessage) {
        state.lastMessage = state.favouriteData.lastMessage
      }
    }

    emitter.on('fav-message', (favMessage: any) => {
      getMessage(favMessage)
    })

    onMounted(() => {
      getNameInitials(personInfo.nameInitials)
    })

    return {
      props,
      state,
      personInfo,
      nameInitials,
      getNameInitials,
      getChat,
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
