<template>
  <div class="container-flex">
    <div class="view chat">
      <header>Conversation with {{ SwitchHeader() }}</header>
      <section class="chat-box">
        <div
          v-for="message in state.messages"
          :key="message.key"
          :class="
            message.username == state.username
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
    userName: {
      type: String,
      required: true,
    },
    userNameId: {
      default: 0,
      type: Number,
      required: true,
    },
    chatNameOrig: {
      type: String,
      required: true,
    },
  },
  setup(props: any) {
    const emitter: any = inject('emitter')
    const inputMessage = ref('')
    const conversationId = ref(0)

    let chatNameId = ref(0)
    let userName = ref(props.userName)
    let chatName = ref(props.chatName)
    let userNameId = ref(props.userNameId)

    const state = reactive({
      userNameId: userNameId.value,
      username: userName,
      messages: [],
    })

    const SendMessage = () => {
      GetConversationId()
      const messageRef = db.database().ref('message')
      if (inputMessage.value === '' || inputMessage.value === null) {
        return
      }

      const message = {
        username: state.username,
        content: inputMessage.value,
        timestamp: Date.now(),
        conversationId: conversationId.value,
      }

      messageRef.push(message)
      inputMessage.value = ''
    }

    const GetConversationId = () => {
      let chatId: number = chatNameId.value
      conversationId.value = parseInt(state.userNameId) * chatId

      console.log(
        parseInt(state.userNameId),
        chatId,
        parseInt(state.userNameId) * chatId
      )
    }

    const SwitchHeader = () => {
      if (!chatName.value) {
        return props.chatNameOrig
      } else {
        return chatName.value
      }
    }

    const messageRef = db.database().ref('message')

    const GetFreshData = (paramConversationId: number) => {
      messageRef.on('value', (snapshot) => {
        const data = snapshot.val()
        let messages: any = []

        Object.keys(data).forEach((key) => {
          messages.push({
            id: key,
            username: data[key].username,
            content: data[key].content,
            timestamp: data[key].timestamp,
            conversationId: data[key].conversationId,
          })
        })

        let clearedMsg = messages.filter(
          (x: any) => x.conversationId == paramConversationId
        )

        state.messages = clearedMsg
      })
    }

    onMounted(() => {
      emitter.on('getChat', (chat: any) => {
        chatNameId.value = chat.id
        chatName.value = chat.chatName

        GetConversationId()
        GetFreshData(conversationId.value)
      })
    })

    onUnmounted(() => {})

    return {
      state,
      inputMessage,
      SendMessage,
      GetFreshData,
      conversationId,
      props,
      chatName,
      chatNameId,
      SwitchHeader,
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
