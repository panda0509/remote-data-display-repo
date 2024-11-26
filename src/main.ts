import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import axios from 'axios'
axios.defaults.baseURL = "http://localhost:8080"

axios.interceptors.request.use(config => {
  // 在发送请求之前做些什么
  return config
}, error => {
  // 处理请求错误
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  // 对响应数据做些什么
  return response
}, error => {
  // 处理响应错误
  return Promise.reject(error)
})


const app = createApp(App)


app.config.globalProperties.$axios = axios

app.provide('axios',axios);
app.mount('#app');