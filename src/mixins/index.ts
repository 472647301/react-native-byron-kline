import Vue from 'vue'
import Component from 'vue-class-component'
import { IDatafeed } from '../utils/datafeed'
import * as IChart from '../types/chart.min'
import Datafeed from '../utils/datafeed'
import overrides from '../config/overrides'
import disabled from '../config/disabled'
import enabled from '../config/enabled'

@Component
class MainMixin extends Vue {
  public datafeed: IDatafeed = new Datafeed(this)
  public widget?: IChart.IChartingLibraryWidget
  public klineData: Array<IChart.Bar> = []

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
      debug: true,
      locale: 'en',
      preset: 'mobile',
      fullscreen: true,
      symbol: 'btcusdt',
      library_path: './',
      container_id: 'trade',
      datafeed: this.datafeed,
      timezone: 'Asia/Shanghai',
      overrides: overrides,
      enabled_features: enabled,
      disabled_features: disabled,
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
}

export default MainMixin
