import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

// Material icons demo:
// https://marella.me/material-icons/demo/
import "material-icons/iconfont/material-icons.css"

import './assets/main.sass'

const app = createApp(App)

app.use(router)

app.mount('#app')
