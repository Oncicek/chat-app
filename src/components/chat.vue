<template>
  <div class="container-flex">
    <div class="row">
      <div class="col">
        <header>Conversation with {{ state.chatName }}</header>
      </div>
      <div class="col">
        <button @click="AddToFavorites(state.userNameId, state.chatNameId)">
          Favorite!
        </button>
      </div>
    </div>
    <div class="view chat">
      <section class="chat-box">
        <div
          v-for="message in state.messages"
          :key="message.key"
          :class="
            message.userNameId == state.userNameId
              ? 'message current-user'
              : 'message'
          "
        >
          <div class="message-inner">
            <div class="username">{{ message.username }}</div>
            <div class="username">
              {{ message.timestamp }}
            </div>
            <div class="content">{{ message.content }}</div>
          </div>
        </div>
      </section>
      <footer>
        <form @submit.prevent="SendMessage">
          <input type="text" v-model="inputMessage" placeholder="write a msg" />
          <input type="submit" value="Send" />
        </form>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, onMounted, ref, inject, onUnmounted } from 'vue'
import db from '../db'

export default {
  props: {
    user: {
      type: Object,
    },
    chatSide: {
      type: Object,
    },
    favoritePeople: {
      type: Object,
    },
  },
  setup(props: any) {
    const emitter: any = inject('emitter')
    const inputMessage = ref('')
    const conversationId = ref(0)
    let favoriteData: any = ref([])
    let user: any = ref([])

    const state = reactive({
      chatName: props.chatSide['displayName'],
      chatNameId: props.chatSide['id'],
      userNameId: props.user['id'],
      conversationId: conversationId,
      username: props.user['displayName'],
      messages: [],
      user: user,
    })

    const SendMessage = () => {
      GetConversationId()
      const messageRef = db.database().ref('message')
      if (inputMessage.value === '' || inputMessage.value === null) {
        return
      }

      const message = {
        userNameId: state.userNameId,
        username: state.username,
        content: inputMessage.value,
        timestamp: Date.now(),
        conversationId: state.conversationId,
      }

      messageRef.push(message)
      inputMessage.value = ''
    }

    const GetConversationId = () => {
      state.conversationId = CalcConvId(state.userNameId, state.chatNameId)
    }

    emitter.on('getChat', (chat: any) => {
      state.chatNameId = chat.id
      state.chatName = chat.chatName

      GetConversationId()
      GetFreshData(state.conversationId)
    })

    const messageRef = db.database().ref('message')

    const GetFavoriteMessage = (favoritePeople: any, messages: any) => {
      favoriteData.value = []

      for (let i = 0; i < favoritePeople.length; i++) {
        let favs: any = {
          convId: CalcConvId(state.userNameId, favoritePeople[i].id) as number,
          favoritePersonId: favoritePeople[i].id as number,
          lastMessage: '',
        }

        favs.lastMessage = GetLastMessage(messages, favs)
        favoriteData.value.push(favs)
      }

      emitter.emit('favMessage', favoriteData.value)
    }

    const CalcConvId = (userNameId: string, chatNameId: any) => {
      return (parseInt(userNameId) + 1) * (parseInt(chatNameId) + 1)
    }

    const GetLastMessage = (messages: any, favs: any) => {
      for (let j = messages.length - 1; j >= 0; j--) {
        if (messages[j].userNameId) {
          if (parseInt(messages[j].conversationId) === parseInt(favs.convId)) {
            console.log(messages[j].content)
            return messages[j].content
          }
        }
      }
    }

    const AddToFavorites = (userId: number, chatId: number) => {
      emitter.emit('addToFavorites', { userId, chatId })
    }

    const GetFreshData = (conversationId: number) => {
      messageRef.on('value', (snapshot) => {
        const data = snapshot.val()
        let messages: any = []

        Object.keys(data).forEach((key) => {
          messages.push({
            id: key,
            userNameId: data[key].userNameId,
            username: data[key].username,
            content: data[key].content,
            timestamp: data[key].timestamp,
            conversationId: data[key].conversationId,
          })
        })

        let clearedMsg = messages.filter(
          (x: any) => x.conversationId === conversationId
        )

        GetFavoriteMessage(props.favoritePeople, messages)

        state.messages = clearedMsg
      })
    }

    onMounted(() => {
      GetConversationId()
      GetFreshData(state.conversationId)
    })

    onUnmounted(() => {
      emitter.off('getChat')
    })

    return {
      state,
      inputMessage,
      SendMessage,
      GetFreshData,
      props,
      CalcConvId,
      favoriteData,
      AddToFavorites,
    }
  },
}
</script>

<style scoped lang="scss">
.view {
  display: flex;
  justify-content: center;
  min-height: 100vh;
  background-color: #aaa;

  &.login {
    align-items: center;
    .login-form {
      display: block;
      width: 100%;
      padding: 15px;

      .form-inner {
        display: block;
        background-color: #fff;
        padding: 50px 15px;
        border-radius: 16px;
        box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
        h1 {
          color: #aaa;
          font-size: 28px;
          margin-bottom: 30px;
        }
        label {
          display: block;
          margin-bottom: 5px;
          color: #aaa;
          font-size: 16px;
          transition: 0.4s;
        }
        input[type='text'] {
          appearance: none;
          border: none;
          outline: none;
          background: none;
          display: block;
          width: 100%;
          padding: 10px 15px;
          border-radius: 8px;
          margin-bottom: 15px;

          color: #333;
          font-size: 18px;
          box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
          background-color: #f3f3f3;
          transition: 0.4s;
          &::placeholder {
            color: #888;
            transition: 0.4s;
          }
        }
        input[type='submit'] {
          appearance: none;
          border: none;
          outline: none;
          background: none;
          display: block;
          width: 100%;
          padding: 10px 15px;
          background-color: #ea526f;
          border-radius: 8px;
          color: #fff;
          font-size: 18px;
          font-weight: 700;
        }
        &:focus-within {
          label {
            color: #ea526f;
          }
          input[type='text'] {
            background-color: #fff;
            box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
            &::placeholder {
              color: #666;
            }
          }
        }
      }
    }
  }
  &.chat {
    flex-direction: column;
    header {
      position: relative;
      display: block;
      width: 100%;
      padding: 50px 30px 10px;
      .logout {
        position: absolute;
        top: 15px;
        right: 15px;
        appearance: none;
        border: none;
        outline: none;
        background: none;

        color: #fff;
        font-size: 18px;
        margin-bottom: 10px;
        text-align: right;
      }
      h1 {
        color: #fff;
      }
    }
    .chat-box {
      max-height: 80vh;
      overflow-y: scroll;
      border-radius: 24px 24px 0px 0px;
      background-color: #fff;
      box-shadow: 0px 0px 12px rgba(100, 100, 100, 0.2);
      flex: 1 1 100%;
      padding: 30px;
      .message {
        display: flex;
        margin-bottom: 15px;

        .message-inner {
          .username {
            color: #888;
            font-size: 16px;
            margin-bottom: 5px;
            padding-left: 15px;
            padding-right: 15px;
          }
          .content {
            display: inline-block;
            padding: 10px 20px;
            background-color: #f3f3f3;
            border-radius: 999px;
            color: #333;
            font-size: 18px;
            line-height: 1.2em;
            text-align: left;
          }
        }
        &.current-user {
          margin-top: 30px;
          justify-content: flex-end;
          text-align: right;
          .message-inner {
            max-width: 75%;
            .content {
              color: #fff;
              font-weight: 600;
              background-color: #ea526f;
            }
          }
        }
      }
    }
    footer {
      position: sticky;
      bottom: 0px;
      background-color: #fff;
      padding: 30px;
      box-shadow: 0px 0px 12px rgba(100, 100, 100, 0.2);
      form {
        display: flex;
        input[type='text'] {
          flex: 1 1 100%;
          appearance: none;
          border: none;
          outline: none;
          background: none;
          display: block;
          width: 100%;
          padding: 10px 15px;
          border-radius: 8px 0px 0px 8px;

          color: #333;
          font-size: 18px;
          box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
          background-color: #f3f3f3;
          transition: 0.4s;
          &::placeholder {
            color: #888;
            transition: 0.4s;
          }
        }

        input[type='submit'] {
          appearance: none;
          border: none;
          outline: none;
          background: none;
          display: block;
          padding: 10px 15px;
          border-radius: 0px 8px 8px 0px;
          background-color: #ea526f;
          color: #fff;
          font-size: 18px;
          font-weight: 700;
        }
      }
    }
  }
}
</style>
