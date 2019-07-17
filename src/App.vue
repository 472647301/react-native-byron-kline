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
  // 加载脚本
  public appendScript(src: string) {
    return new Promise(resolve => {
      const script = document.createElement('script')
      script.src = src
      document.head.appendChild(script)
      script.onload = function() {
        resolve()
        console.info(` >> ${src} 加载成功`)
      }
    })
  }
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
      await this.appendScript('./script/vendors.min.js')
      await this.appendScript('./script/library.min.js')
    })
  }
  /**
   * 接收消息
   */
  public receiveMessage(event: any) {
    const info = JSON.parse(event.data)
    const data = info.data
    switch (info.event) {
      case 'chartInit': // 图表初始化
        this.symbol = data.symbol || 'BTC'
        this.interval = data.interval || '5'
        this.isDebug = data.isDebug || false
        this.pricescale = data.pricescale || 100
        this.chartInit()
        break
    }
  }
  public created() {
    document.addEventListener('message', this.receiveMessage.bind(this))
  }
}
export default App
</script>
