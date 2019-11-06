<template>
  <div id="app">
    <div id="tradingview"></div>
    <img @click="imageUrl = ''" v-if="imageUrl" :src="imageUrl" alt class="image" />
  </div>
</template>

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

<script lang="ts">
import MainMixin from './mixins'
import Component, { mixins } from 'vue-class-component'
import Datafeed from './utils/datafeed'
import html2canvas from 'html2canvas'

// import native from './native'

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
      const message = {
        event: 'initDone',
        data: {
          to: 0,
          from: 0,
          resolution: this.interval,
          symbol: this.symbol
        }
      }
      this.postMessage(JSON.stringify(message))
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
        this.klineData = this.forEachKlineData(data.kline || [])
        this.isLoading = false
        break
      case 'renderChartMoreData': // 渲染图表更多数据
        this.klineData = this.forEachKlineData(data.kline || [])
        this.isLoading = false
        break
      case 'renderChartSub': // 渲染图表订阅数据
        if (data.kline && data.kline.length && !this.isLoading) {
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
          this.studyList[name] = chart.createStudy(
            name,
            false,
            false,
            value,
            undefined,
            data.studyPlot
          )
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
      case 'createScreenShot':
        const width = window.innerWidth // 获取dom 宽度
        const height = window.innerHeight // 获取dom 高度
        const canvas = document.createElement('canvas') // 创建一个canvas节点
        const scale = 2 // 定义任意放大倍数 支持小数
        canvas.width = width * scale // 定义canvas 宽度 * 缩放
        canvas.height = height * scale // 定义canvas高度 *缩放
        canvas.getContext('2d') // 获取context
        html2canvas(document.body, {
          scale: scale, // 添加的scale 参数
          canvas: canvas, // 自定义 canvas
          // logging: true, // 日志开关，便于查看html2canvas的内部执行流程
          width: width, // dom 原始宽度
          height: height,
          useCORS: true // 【重要】开启跨域配置
        }).then(canvas => {
          const context = canvas.getContext('2d')
          this.imageUrl = canvas.toDataURL('image/png')
          this.postMessage(JSON.stringify({ event: 'createScreenShotDone' }))
        })
        break
      case 'deleteScreenShot':
        this.imageUrl = ''
        this.postMessage(JSON.stringify({ event: 'deleteScreenShotDone' }))
        break
      default:
        if (this.widget && (this.widget as any)[message.event]) {
          const widget = this.widget as any
          const data = message.data
          const __widget = widget[message.event]()
          if (data.event && __widget[data.event]) {
            __widget[data.event](data.data)
          }
        }
        break
    }
  }
  public created() {
    window.sendMessageHtml = this.receiveMessage.bind(this)
  }
}
export default App

// 全局对象
declare global {
  interface Window {
    TradingView: any
    zhuwenbo: any
    urlParams: any
    sendMessageHtml: any
  }
}
</script>
