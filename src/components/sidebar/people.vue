<template>
  <div>
    <table>
      <tbody>
        <tr>
          <td>
            <div class="circle">
              {{ personInfo.nameInitials }}
            </div>
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
  },

  setup(props: any) {
    const emitter: any = inject('emitter')
    let nameInitials = ref(props.person.fullName)

    const personInfo = reactive({
      nameInitials: nameInitials.value,
    })

    const state = reactive({
      userId: props.person['id'],
    })

    const GetNameInitials = (fullName: string) => {
      let name = fullName.split(' ')
      personInfo.nameInitials = name[0].charAt(0) + name[1].charAt(0)
    }

    const peopleBtn = (event: any) => {
      if (event.target.value == 0) {
        emitter.emit('favFromPeople', state.userId)
      } else {
        emitter.emit('destroyFromPeople', state.userId)
      }
      console.log(event.target.value)
    }

    onMounted(() => {
      GetNameInitials(personInfo.nameInitials)
      console.log(personInfo.nameInitials)
    })

    return {
      props,
      peopleBtn,
      state,
      personInfo,
      nameInitials,
      GetNameInitials,
    }
  },
}
</script>

<style lang="scss" scoped>
.displayName {
  padding-left: 10px;
}

.circle {
  width: 30px;
  height: 30px;
  border-radius: 250px;
  font-size: 13px;
  color: white;
  font-weight: bold;
  text-align: center;
  background: rgb(150, 150, 150);
  border: 0px;
  float: right;
  padding-top: 20%;
}
</style>
