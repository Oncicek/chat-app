<template>
  <div
    class="container"
    @mouseover="state.hover = true"
    @mouseleave="state.hover = false"
    @click="getChat(person.id, person.displayName)"
  >
    <div class="row">
      <div class="col-1">
        <div class="circle">
          {{ personInfo.nameInitials }}
        </div>
      </div>
      <div class="col-10 display-name">
        {{ person.displayName }}
      </div>
      <div class="col-1 dropdown-wrapper">
        <dropdown-component
          class="dropdown"
          :class="{ 'show-btn': state.hover }"
          :options="options"
          :userId="state.userId"
        ></dropdown-component>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, onMounted, ref, inject } from 'vue'
import DropdownComponent from '../shared/dropdown.vue'

export default {
  components: { DropdownComponent },
  props: {
    person: {
      type: Object,
      required: true,
    },
  },

  setup(props: any) {
    const emitter: any = inject('emitter')
    let nameInitials = ref(props.person.fullName)
    let userId: any = ref(props.person['id'])

    const options = ref([
      { value: 'Favorites Add / Remove', id: 0 },
      { value: 'Remove from People', id: 1 },
    ])

    const personInfo = reactive({
      nameInitials: nameInitials.value,
    })

    const getChat = (id: number, chatName: string) => {
      emitter.emit('get-chat', { id, chatName })
    }

    const state = reactive({
      userId: parseInt(userId.value),
      hover: false,
    })

    const getNameInitials = (fullName: string) => {
      let name = fullName.split(' ')
      personInfo.nameInitials = name[0].charAt(0) + name[1].charAt(0)
    }

    onMounted(() => {
      getNameInitials(personInfo.nameInitials)
    })

    return {
      props,
      state,
      personInfo,
      nameInitials,
      getNameInitials,
      options,
      getChat,
    }
  },
}
</script>

<style lang="scss" scoped>
.circle {
  padding-top: 6px;
  width: 30px;
  height: 30px;
  border-radius: 250px;
  font-size: 13px;
  color: white;
  font-weight: bold;
  text-align: center;
  background: rgb(150, 150, 150);
  border: 0px;
}

.dropdown {
  display: none;
}

.display-name {
  padding-top: 2px;
}

.dropdown-wrapper {
  padding-top: 2px;
  float: right;
}

.show-btn {
  display: block;
}
</style>
