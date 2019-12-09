import Vue from 'vue'
import Component from 'vue-class-component'
import * as TradingView from 'byron-kline-chart'
import { Datafeed, IDatafeed } from 'byron-kline-datafeed'
import { Bar } from 'byron-kline-datafeed'
import html2canvas from 'html2canvas'
import * as CONFIG from './config'
import vconsole from 'vconsole'

@Component
class KlineChart extends Vue {
  public widget?: TradingView.IChartingLibraryWidget
  public datafeed?: IDatafeed
  public klineData: Bar[] = []
  public symbol = 'BTC/USDT'
  public interval = '15'
  public awaitCount = 0
  public isAwait = true
  public locale: TradingView.LanguageCode = 'zh'
  public debug = false
  public device: IDevice = 'rn'
  public pricescale = 100
  public studyList: IStudy = {}
  public datafeedConfiguration?: TradingView.DatafeedConfiguration
  public librarySymbolInfo?: TradingView.LibrarySymbolInfo
  public chartingLibraryWidgetOptions?: TradingView.ChartingLibraryWidgetOptions
  public imageUrl = ''

  /**
   * 发送消息给原生
   */
  public sendMessageToNative(info: string) {
    switch (this.device) {
      case 'rn':
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(info)
        }
        break
      case 'ios':
        break
      case 'android':
        break
    }
  }

  /**
   * 接收原生通知
   */
  public receiveNativeNotification(msg: INativeNotice) {
    const data = msg.data || {}
    console.info(' >> Receive native notification:', msg)
    switch (msg.event) {
      case INativeEvents.INIT: // 图表初始化
        if (data.symbol) {
          this.symbol = data.symbol
        }
        if (data.interval) {
          this.interval = data.interval
        }
        if (data.debug) {
          this.debug = data.debug
          const v = new vconsole()
          console.info(v.version)
        }
        if (data.locale) {
          this.locale = data.locale
        }
        if (data.pricescale) {
          this.pricescale = data.pricescale
        }
        if (data.librarySymbolInfo) {
          this.librarySymbolInfo = data.librarySymbolInfo
        }
        if (data.datafeedConfiguration) {
          this.datafeedConfiguration = data.datafeedConfiguration
        }
        if (data.chartingLibraryWidgetOptions) {
          this.chartingLibraryWidgetOptions = data.chartingLibraryWidgetOptions
        }
        this.initDatafeed()
        this.initTradingView()
        const _info = JSON.stringify({
          event: IHtmlEvents.INIT_DONE
        })
        this.sendMessageToNative(_info)
        break
      case INativeEvents.HISTORY: // 图表历史
        if (data.kline && this.isAwait) {
          this.klineData = data.kline
          this.isAwait = false
          const _msg = JSON.stringify({
            event: IHtmlEvents.HISTORY_DONE
          })
          this.sendMessageToNative(_msg)
        }
        break
      case INativeEvents.SUBSCRIBE: // 图表订阅
        if (data.kline && !this.isAwait && this.datafeed) {
          this.datafeed.updateData({
            bars: data.kline,
            meta: { noData: !data.kline.length }
          })
          const _msg = JSON.stringify({
            event: IHtmlEvents.SUBSCRIBE_DONE
          })
          this.sendMessageToNative(_msg)
        }
        break
      case INativeEvents.TYPE: // 图表类型
        if (data.type && this.widget) {
          this.widget.chart().setChartType(data.type)
          const _msg = JSON.stringify({
            event: IHtmlEvents.TYPE_DONE
          })
          this.sendMessageToNative(_msg)
        }
        break
      case INativeEvents.STUDY: // 图表指标
        if (data.studyName && this.widget) {
          const name = data.studyName
          const value = data.studyValue || []
          const chart = this.widget.chart()
          if (data.studyId && this.studyList[data.studyId]) {
            const study = chart.getStudyById(this.studyList[data.studyId])
            const oldValue = study.getInputValues()
            if (study.isUserEditEnabled()) {
              oldValue[0].value = Number(value[0] || 0)
              oldValue[1].value = Number(value[1] || 0)
              study.setInputValues(oldValue)
              console.info(' >> Update study success:', data.studyId, study, oldValue)
              const _msg = JSON.stringify({
                event: IHtmlEvents.STUDY_DONE
              })
              this.sendMessageToNative(_msg)
            }
          } else {
            chart.createStudy(
              name,
              false,
              false,
              value,
              undefined,
              data.studyPlot
            ).then(v => {
              console.info(' >> Created study success:', data.studyId, v, value)
              if (data.studyId && v) {
                this.studyList[data.studyId] = v
              }
              const _msg = JSON.stringify({
                event: IHtmlEvents.STUDY_DONE
              })
              this.sendMessageToNative(_msg)
            })
          }
        }
        break
      case INativeEvents.INTERVAL: // 图表周期
        if (data.interval && this.widget) {
          const chart = this.widget.chart()
          chart.setResolution(data.interval, () => {
            chart.executeActionById('timeScaleReset')
            const _msg = JSON.stringify({
              event: IHtmlEvents.INTERVAL_DONE
            })
            this.sendMessageToNative(_msg)
          })
        }
        break
      case INativeEvents.CREATE_SHOT:
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
          logging: this.debug, // 日志开关，便于查看html2canvas的内部执行流程
          width: width, // dom 原始宽度
          height: height,
          useCORS: true // 【重要】开启跨域配置
        }).then(canvas => {
          this.imageUrl = canvas.toDataURL('image/png')
          const _msg = JSON.stringify({
            event: IHtmlEvents.CREATE_SHOT_DONE
          })
          this.sendMessageToNative(_msg)
        })
        break
      case INativeEvents.REMOVE_SHOT:
        this.imageUrl = ''
        const _msg = JSON.stringify({
          event: IHtmlEvents.REMOVE_SHOT_DONE
        })
        this.sendMessageToNative(_msg)
        break
      default:
        if (this.widget && msg.data.event) {
          const widget = this.widget as IWidget
          const _widget = widget[msg.data.event] ? widget[msg.data.event]() : {}
          if (_widget && _widget[msg.data.data.event]) {
            _widget[msg.data.data.event](data.data.data)
          }
          const _msg = JSON.stringify({
            event: msg.event
          })
          this.sendMessageToNative(_msg)
        }
        break
    }
  }

  /**
   * 异步延迟等待
   */
  public delayAwait(): Promise<IDelayAwait> {
    return new Promise((resolve, reject) => {
      this.awaitCount++
      console.info(`>> Await count: ${this.awaitCount * 300}ms`)
      if (!this.isAwait) {
        return resolve(this.klineData)
      } else {
        return this.awaitCount < 100 ? reject() : resolve()
      }
    }).catch(() => {
      return new Promise(resolve => {
        setTimeout(resolve, 300)
      }).then(() => this.delayAwait())
    })
  }

  /**
   * 初始化 JS API
   */
  public initDatafeed() {
    const symbol = this.symbol.toLocaleUpperCase()
    const _config = {
      supports_search: true,
      supports_group_request: false,
      supported_resolutions: ['1', '5', '15', '30', '60', 'D', 'W', 'M'],
      supports_marks: false,
      supports_timescale_marks: false,
      supports_time: false
    }
    const _symbols = {
      name: symbol,
      full_name: symbol,
      description: symbol,
      type: symbol,
      session: '24x7',
      exchange: symbol,
      listed_exchange: symbol,
      timezone: 'Asia/Shanghai',
      format: 'price',
      pricescale: this.pricescale,
      minmov: 1,
      has_intraday: true,
      supported_resolutions: ['1', '5', '15', '30', '60', 'D', 'W', 'M']
    }
    this.datafeed = new Datafeed({
      history: params => {
        return this.fetchHistoryData(params)
      },
      config: () => {
        const _c = this.datafeedConfiguration
        return new Promise(resolve => resolve(Object.assign(_config, _c)))
      },
      symbols: () => {
        const _c = this.librarySymbolInfo
        return new Promise(resolve => resolve(Object.assign(_symbols, _c)))
      }
    })
  }

  /**
   * 初始化图表
   */
  public async initTradingView() {
    if (!this.datafeed) {
      return
    }
    const _data = {
      autosize: true,
      preset: 'mobile',
      debug: this.debug, // uncomment this line to see Library errors and warnings in the console
      fullscreen: true,
      symbol: this.symbol,
      interval: this.interval,
      container_id: 'tv_chart_container',
      datafeed: this.datafeed,
      library_path: './charting_library/',
      locale: this.locale,
      disabled_features: CONFIG.disabled,
      enabled_features: CONFIG.enabled,
      charts_storage_url: 'http://saveload.tradingview.com',
      charts_storage_api_version: '1.1',
      client_id: 'tradingview.com',
      user_id: 'public_user_id',
      theme: 'Dark',
      timezone: 'Asia/Shanghai',
      studies_overrides: CONFIG.studies
    }
    const _c = this.chartingLibraryWidgetOptions
    if (_c && _c.disabled_features && _data.disabled_features) {
      _c.disabled_features = _c.disabled_features.concat(_data.disabled_features)
    }
    if (_c && _c.enabled_features && _data.enabled_features) {
      _c.enabled_features = _c.enabled_features.concat(_data.enabled_features)
    }
    this.widget = new TradingView.widget(Object.assign(_data, _c))
    await this.appendScript('bundles/byron-kline-chart-init.js')
    this.appendScript('bundles/runtime.d2ecd186b98a62a23c4b.js')
    this.appendScript('bundles/vendors.f7dbb6a11b34b2534314.js')
    this.appendScript('bundles/library.ac4616c46f24eefd2d78.js')
  }

  /**
   * 获取历史数据
   */
  public async fetchHistoryData(params: IParams) {
    if (this.interval !== params.resolution) {
      const _msg = JSON.stringify({
        event: IHtmlEvents.INTERVAL_SWITCH,
        data: Object.assign(params, { oldResolution: this.interval })
      })
      this.sendMessageToNative(JSON.stringify(_msg))
      this.interval = params.resolution
    }
    const _msg = JSON.stringify({
      event: IHtmlEvents.FETCH_HISTORY,
      data: params
    })
    if (!this.isAwait) {
      this.isAwait = true
    }
    this.sendMessageToNative(_msg)
    const data = await this.delayAwait()
    this.klineData = []
    this.awaitCount = 0
    return {
      bars: data,
      meta: { noData: !data.length }
    }
  }

  // 加载脚本
  public appendScript(src: string) {
    return new Promise(resolve => {
      const script = document.createElement('script')
      script.src = src
      document.head.appendChild(script)
      script.onload = function () {
        resolve()
        console.info(` >> ${src} 初始化成功`)
      }
    })
  }

  public created() {
    window.sendMessageToHtml = this.receiveNativeNotification.bind(this)
  }

  public mounted() { }
}

export default KlineChart

type IStudy = any
type IWidget = any
type IDelayAwait = any
type IDevice = 'rn' | 'ios' | 'android'
type IReactNativeWebView = {
  postMessage(msg: string): void
}
declare global {
  interface Window {
    ReactNativeWebView: IReactNativeWebView
    sendMessageToHtml: (msg: INativeNotice) => void
  }
}
enum IHtmlEvents {
  /**
   * 初始化完成
   */
  INIT_DONE = 'INIT_DONE',
  /**
   * 获取历史数据
   */
  FETCH_HISTORY = 'FETCH_HISTORY',
  /**
   * 历史数据处理完成
   */
  HISTORY_DONE = 'HISTORY_DONE',
  /**
   * 订阅数据处理完成
   */
  SUBSCRIBE_DONE = 'SUBSCRIBE_DONE',
  /**
   * 类型处理完成
   */
  TYPE_DONE = 'TYPE_DONE',
  /**
   * 指标处理完成
   */
  STUDY_DONE = 'STUDY_DONE',
  /**
   * 周期处理完成
   */
  INTERVAL_DONE = 'INTERVAL_DONE',
  /**
   * 周期切换
   */
  INTERVAL_SWITCH = 'INTERVAL_SWITCH',
  /**
   * 创建截图完成
   */
  CREATE_SHOT_DONE = 'CREATE_SHOT_DONE',
  /**
   * 移除截图完成
   */
  REMOVE_SHOT_DONE = 'REMOVE_SHOT_DONE'
}

type INativeNotice = {
  event: INativeEvents
  data: INativeData
}

type INativeData = {
  symbol?: string
  interval?: string
  debug?: boolean
  locale?: TradingView.LanguageCode
  pricescale?: number
  librarySymbolInfo?: TradingView.LibrarySymbolInfo
  datafeedConfiguration?: TradingView.DatafeedConfiguration
  chartingLibraryWidgetOptions?: TradingView.ChartingLibraryWidgetOptions
  kline?: Array<Bar>
  type?: TradingView.SeriesStyle
  studyName?: string
  studyValue?: Array<number>
  studyId?: string
  studyPlot?: TradingView.CreateStudyOptions
  event?: string
  data?: any
}

type IParams = {
  symbol: string
  resolution: string
  from: number
  to: number
  isFirst?: boolean
  oldResolution?: string
}

enum INativeEvents {
  /**
   * 初始化
   */
  INIT = 'INIT',
  /**
   * 历史数据处理
   */
  HISTORY = 'HISTORY',
  /**
   * 订阅处理
   */
  SUBSCRIBE = 'SUBSCRIBE',
  /**
   * 类型处理
   */
  TYPE = 'TYPE',
  /**
   * 指标处理
   */
  STUDY = 'STUDY',
  /**
   * 周期处理
   */
  INTERVAL = 'INTERVAL',
  /**
   * 创建截图
   */
  CREATE_SHOT = 'CREATE_SHOT',
  /**
   * 移除截图
   */
  REMOVE_SHOT = 'REMOVE_SHOT',
  /**
   * DEFAULT
   */
  DEFAULT = 'DEFAULT'
}