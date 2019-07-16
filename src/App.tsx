import React from 'react'
import Datafeed from './utils/datafeed'
import { IDatafeed } from './utils/datafeed'
import * as IChart from './types/chart.min'
import enabledFeatures from './config/enabled'
import disabledFeatures from './config/disabled'
import overridesConfig from './config/overrides'
import axios from 'axios'
import moment from 'moment'

// 全局对象
declare global {
  interface Window {
    zhuwenbo: any
    urlParams: any
    TradingView: any
  }
}

interface IAppState {
  klineData: Array<IChart.Bar>
}

class App extends React.Component {
  public state: IAppState = {
    klineData: []
  }

  public datafeed: IDatafeed = new Datafeed(this)
  public widget?: IChart.IChartingLibraryWidget

  /**
   * 返回配置
   */
  public returnConfig(): IChart.DatafeedConfiguration {
    return {}
  }

  /**
   * 返回商品
   */
  public returnSymbol(): IChart.LibrarySymbolInfo {
    return {}
  }

  /**
   * getBars
   */
  public getBars(
    symbolInfo: IChart.LibrarySymbolInfo,
    resolution: IChart.ResolutionString,
    rangeStartDate: number,
    rangeEndDate: number,
    onResult: IChart.HistoryCallback,
    onError: IChart.ErrorCallback,
    isFirstCall: boolean,
    isSubscribe: boolean
  ) {
    const { klineData } = this.state
    if (isFirstCall && klineData.length) {
      console.warn(' >> 已有历史数据渲染.')
      onResult(klineData, { noData: false })
      return
    }
    if (isFirstCall && !klineData.length) {
      console.warn(' >> 请求历史数据渲染.')
      axios
        .post('/api/v1/exchange/ticker/getScaleByDate', {
          from: rangeStartDate,
          symbol: 'btcusdt',
          to: rangeEndDate,
          type: 'MIN_5'
        })
        .then(res => {
          if (res.data.data) {
            const bars: Array<IChart.Bar> = []
            res.data.data.forEach((item: any) => {
              bars.push({
                time:
                  Number(moment(item.date, 'YYYY-MM-DD HH:mm:ss').format('X')) *
                  1000,
                open: item.open,
                high: item.high,
                low: item.low,
                close: item.close,
                volume: item.volume
              })
            })
            onResult(bars, { noData: false })
            if (this.widget) {
              const study = this.widget.chart()
              study.createStudy('MA Cross', false, false, [30, 120])
            }
          }
        })
    }
    if (!isFirstCall && isSubscribe) {
      console.warn(' >> 订阅实时数据渲染.')
    }
    if (!isFirstCall && !isSubscribe) {
      console.warn(' >> 请求更多数据渲染.')
    }
  }

  /**
   * 返回初始化配置
   */
  public returnOptions() {
    return {
      //debug: true,
      locale: 'en',
      preset: 'mobile',
      fullscreen: true,
      symbol: 'btcusdt',
      library_path: './',
      container_id: 'trade',
      datafeed: this.datafeed,
      timezone: 'Asia/Shanghai',
      overrides: overridesConfig,
      enabled_features: enabledFeatures,
      disabled_features: disabledFeatures,
      interval: '5',
      studies_overrides: {
        'MA Cross.short:plot.color': '#f103f2',
        'MA Cross.long:plot.color': '#fff900',
        'MA Cross.crosses:plot.color': '#f00',
        'MA Cross.crosses:plot.linewidth': 0,
        'volume.volume.color.0': 'rgba(234,0,112,0.6)',
        'volume.volume.color.1': 'rgba(112,168,0,0.6)'
      },
      MA_Cross_style: {
        'short:plot.color': '#f103f2',
        'long:plot.color': '#fff900'
      },
      volume_style: {
        'volume.color.0': 'rgba(234,0,112,0.6)',
        'volume.color.1': 'rgba(112,168,0,0.6)'
      }
    }
  }

  /**
   * name
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

  // 加载js
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

  /**
   *  初始化图表
   */
  public chartInit() {
    console.info(' >> Initialization chart.')
    window.TradingView.onready(async () => {
      console.info(' >> tradingview onready.')
      this.widget = new window.TradingView.widget(this.returnOptions())
      this.urlParamsInit()
      await this.appendScript('./bundles/vendors.js')
      await this.appendScript('./bundles/library.js')
    })
  }

  public componentDidMount() {
    this.chartInit()
  }

  public render() {
    return <div id="trade" />
  }
}

export default App
