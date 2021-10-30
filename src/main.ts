import Vue, { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons'

import mitt from 'mitt'   
const emitter = mitt()

createApp(App).provide('emitter', emitter).mount('#app')