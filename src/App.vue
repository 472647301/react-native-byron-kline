<template>
  <div id="app"></div>
</template>

<script lang="ts">
import MainMixin from './mixins'
import Component, { mixins } from 'vue-class-component'

@Component({
  components: {
    MainMixin
  }
})
class App extends mixins(MainMixin) {
  // 加载脚本
  public appendScript(src: string) {
    return new Promise(resolve => {
      const script = document.createElement('script')
      script.src = src
      document.head.appendChild(script)
      script.onload = function() {
        resolve()
        console.info(` >> ${src} 初始化成功`)
      }
    })
  }
  created() {
    console.log(this.klineData)
  }
}
export default App
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
