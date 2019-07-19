<template>
  <div id="app"></div>
</template>

<script lang="ts">
import MainMixin from './mixins'
import Component, { mixins } from 'vue-class-component'
import Datafeed from './utils/datafeed'

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
  public initializationChart() {
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
  public receiveMessage(message: any) {
    console.info(` >> Receive message:`, message)
    if (!message || !message.event || !message.data) {
      return
    }
    if (typeof message === 'string') {
      this.postMessage(`[Data type error]:${message}`)
      return
    }
    const data = message.data
    switch (message.event) {
      case 'initChart': // 图表初始化
        this.symbol = data.symbol || 'BTC'
        this.interval = data.interval || '5'
        this.isDebug = data.isDebug || false
        this.pricescale = data.pricescale || 100
        if (data.datafeedConfig) {
          this.datafeedConfig = data.datafeedConfig
        }
        if (data.optionsConfig) {
          this.optionsConfig = data.optionsConfig
        }
        if (data.symbolConfig) {
          this.symbolConfig = data.symbolConfig
        }
        if (data.isDebug) {
          const VConsole = require('vconsole')
          const vsonsole = new VConsole()
          this.datafeed.isDebug = true
          console.info(` >> init data:`, message)
        }
        this.datafeed.initialize()
        this.initializationChart()
        break
      case 'renderChartData': // 渲染图表历史数据
        if (data.kline && data.kline.length) {
          const newList = []
          for (let i = 0; i < data.kline.length; i++) {
            newList.push(data.kline[i])
          }
          newList.sort((l, r) => (l.time > r.time ? 1 : -1))
          this.klineData = newList
        }
        break
      case 'renderChartSub': // 渲染图表订阅数据
        if (data.kline && data.kline.length) {
          this.klineData = this.forEachKlineData(data.kline)
          this.datafeed.barsPulseUpdater.update()
        }
        break
      case 'changeChartType': // 改变图表类型
        if (data.type && this.widget) {
          const chart = this.widget.chart()
          chart.setChartType(data.type)
        }
        break
      case 'createChartStudy': // 创建图表指标
        if (data.studyName && this.widget) {
          const name = data.studyName
          const value = data.studyValue || []
          const chart = this.widget.chart()
          this.studyList[name] = chart.createStudy(name, false, false, value)
          const minbtn = document.querySelector('.pane-legend-minbtn')
          if (minbtn) (minbtn as any).click()
        }
        break
      case 'updateChartStudy': // 更新图表指标
        if (data.studyName && this.widget) {
          const name = data.studyName
          const value = data.studyValue || []
          const chart = this.widget.chart()
          if (this.studyList[name]) {
            const study = chart.getStudyById(this.studyList[name])
            const oldValue = study.getInputValues()
            if (study.isUserEditEnabled()) {
              oldValue[0].value = Number(value[0] || 0)
              oldValue[1].value = Number(value[1] || 0)
              study.setInputValues(oldValue)
              console.info(' >> Update study success:', oldValue)
            }
          }
        }
        break
      case 'changeChartResolution': // 改变图表周期
        if (data.interval && this.widget) {
          const chart = this.widget.chart()
          chart.setResolution(data.interval, function() {})
        }
        break
    }
  }
  public created() {
    window.sendMessageHtml = this.receiveMessage.bind(this)
  }
}
export default App
</script>
