import Vue from 'vue'
import enabled from '../config/enabled'
import Datafeed from '../utils/datafeed'
import Component from 'vue-class-component'
import * as options from '../config/options'
import { IDatafeed } from '../utils/datafeed'
import * as IChart from '../types/chart.min'
import overrides from '../config/overrides'
import disabled from '../config/disabled'

// const data = require('../data')

@Component
class MainMixin extends Vue {
  public datafeed: IDatafeed = new Datafeed(this)
  public widget?: IChart.IChartingLibraryWidget
  public klineData: Array<IChart.Bar> = []
  public isDebug: boolean = false
  public symbol = 'BTCUSD'
  public interval = '5'
  public pricescale = 100

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
    return {
      name: this.symbol,
      ticker: this.symbol,
      description: this.symbol,
      pricescale: this.pricescale
    }
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
    if (isFirstCall && this.klineData.length) {
      console.warn(' >> 已有历史数据渲染.')
      onResult(this.klineData, { noData: false })
      return
    }
    if (isFirstCall && !this.klineData.length) {
      console.warn(' >> 请求历史数据渲染.')
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
      locale: 'en',
      preset: 'mobile',
      fullscreen: true,
      library_path: './',
      container_id: 'app',
      symbol: this.symbol,
      debug: this.isDebug,
      overrides: overrides,
      interval: this.interval,
      datafeed: this.datafeed,
      timezone: 'Asia/Shanghai',
      enabled_features: enabled,
      disabled_features: disabled,
      studies_overrides: options.studies,
      MA_Cross_style: options.cross,
      volume_style: options.volume
    }
  }
  /**
   * 发送消息
   */
  public postMessage(message: string) {
    window.postMessage(JSON.stringify(message), '*')
  }
}

export default MainMixin
