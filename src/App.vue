<template>
  <div id="app"></div>
</template>

<script lang="ts">
import MainMixin from './mixins'
import Component, { mixins } from 'vue-class-component'

// 全局对象
declare global {
  interface Window {
    [key: string]: any
  }
}

@Component({
  components: {
    MainMixin
  }
})
class App extends mixins(MainMixin) {
  /**
   * urlParamsInit
   */
  public urlParamsInit() {
    const zhuwenbo = function() {
      let j
      const h = /\+/g
      const m = /([^&=]+)=?([^&]*)/g
      const e = function(o: any) {
        return decodeURIComponent(o.replace(h, ' ')).replace(
          /<\/?[^>]+(>|$)/g,
          ''
        )
      }
      const k = (function() {
        return window.zhuwenbo
      })()
      const n: any = {}
      while ((j = m.exec(k))) {
        n[e(j[1])] = e(j[2])
      }
      const l = window[n.uid]
      const i = ['datafeed', 'customFormatters', 'brokerFactory']
      for (let g in l) {
        if (i.indexOf(g) === -1) {
          n[g] = JSON.stringify(l[g])
        }
      }
      return n
    }
    window.urlParams = zhuwenbo()
  }
  /**
   *  初始化图表
   */
  public chartInit() {
    console.info(' >> Initialization chart.')
    window.TradingView.onready(async () => {
      console.info(' >> tradingview onready.')
      this.widget = new window.TradingView.widget(this.returnOptions())
      this.urlParamsInit()
      require('./script/vendors.min.js')
      require('./script/library.min.js')
    })
  }
  /**
   * 接收消息
   */
  public receiveMessage(event: any) {
    const info = JSON.parse(event)
    const data = info.data
    switch (info.event) {
      case 'chartInit': // 图表初始化
        this.symbol = data.symbol || 'BTC'
        this.interval = data.interval || '5'
        this.isDebug = data.isDebug || false
        this.pricescale = data.pricescale || 100
        if (data.isDebug) {
          const VConsole = require('vconsole')
          const vsonsole = new VConsole()
        }
        this.chartInit()
        break
      case 'postChartData': // 发送图表数据
        if (data && data.length) {
          data.sort((l: any, r: any) => (l.time > r.time ? 1 : -1))
          data.forEach((element: any) => {
            this.klineData.push(element)
          })
        }
        break
      case 'changeChartType': // 改变图表类型
        break
      case 'createChartStudy': // 创建图表指标
        break
      case 'updateChartStudy': // 更新图表指标
        break
      case 'changeChartResolution': // 改变图表周期
        break
    }
  }
  public created() {
    window.receiveMessage = this.receiveMessage.bind(this)
    document.addEventListener('message', this.receiveMessage.bind(this))
  }
}
export default App
</script>
