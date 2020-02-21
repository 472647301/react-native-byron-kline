import Vue from 'vue'
import App from './App.vue'
import './css/index.css'
import './locale/index'

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
