<style>
.image {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 150;
}
</style>

<template>
  <div id="app">
    <div id="tv_chart_container"></div>
    <img @click="imageUrl = ''" v-if="imageUrl" :src="imageUrl" alt class="image" />
  </div>
</template>

<script lang="ts">
import KlineChart from './app'
import Component, { mixins } from 'vue-class-component'

@Component({
  components: {
    KlineChart
  }
})
class App extends mixins(KlineChart) {}
export default App
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
</style>
