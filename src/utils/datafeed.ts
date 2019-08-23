import App from '../mixins'
import * as IChart from '../types/chart.min'
import { IDataPulse } from './datapulse'
import DataPulse from './datapulse'
interface IApp extends App {}

export default class Datafeed {
  public app: IApp
  public config?: IChart.DatafeedConfiguration
  public lastBarEndTime: { [key: string]: number }
  public isDebug?: boolean
  public barsPulseUpdater: IDataPulse

  constructor(app: IApp) {
    this.app = app
    this.lastBarEndTime = {}
    this.barsPulseUpdater = new DataPulse(this)
    this.isDebug = false
  }

  /**
   * 默认配置
   */
  public defaultConfig() {
    return {
      exchanges: [],
      symbols_types: [],
      supports_time: true,
      supports_marks: true,
      supports_search: false,
      supports_group_request: false,
      supports_timescale_marks: true,
      supported_resolutions: ['1', '5', '15', '30', '60', 'D', 'W', 'M']
    }
  }

  /**
   * 初始化
   */
  public initialize() {
    const _default = this.defaultConfig()
    const __default = this.app.returnConfig()
    this.config = Object.assign(_default, __default)
    this.debugLog('Datafeed initialize done.', this.config)
  }

  /**
   * debug
   */
  public debugLog(...args: any) {
    if (this.isDebug) {
      console.log(' >> DD:', ...args)
    }
  }

  /**
   * getServerTime
   */
  public getServerTime() {}

  /**
   * @param {*Function} callback  回调函数
   * `onReady` should return result asynchronously.
   */
  public onReady(callback: IChart.OnReadyCallback) {
    return new Promise(resolve => resolve()).then(() => {
      if (this.config) {
        callback(this.config)
      }
      this.debugLog('Datafeed onReady done.')
    })
  }

  /**
   * 默认商品配置
   */
  public defaultSymbol() {
    let resolutions: Array<any> | undefined = []
    if (this.config) {
      resolutions = this.config.supported_resolutions
    }
    return {
      minmov: 1,
      minmov2: 0,
      pointvalue: 1,
      session: '24x7',
      fractional: false,
      has_intraday: true,
      has_no_volume: false,
      timezone: 'Asia/Shanghai',
      supported_resolutions: resolutions,
      intraday_multipliers: ['1', '5', '15', '30', '60', 'D', 'W', 'M']
    }
  }

  /**
   * @param {*String} symbolName  商品名称或ticker
   * @param {*Function} onSymbolResolvedCallback 成功回调
   * @param {*Function} onResolveErrorCallback   失败回调
   * `resolveSymbol` should return result asynchronously.
   */
  public resolveSymbol(
    symbolName: string,
    onResolve: IChart.ResolveCallback,
    onError: IChart.ErrorCallback
  ) {
    return new Promise(resolve => resolve()).then(() => {
      const _symbol = this.defaultSymbol()
      const __symbol = this.app.returnSymbol()
      onResolve(Object.assign(_symbol, __symbol))
      this.debugLog(
        'Datafeed resolveSymbol done.',
        Object.assign(_symbol, __symbol)
      )
    })
  }

  /**
   * @param {*Object} symbolInfo  商品信息对象
   * @param {*String} resolution  分辨率
   * @param {*Number} rangeStartDate  时间戳、最左边请求的K线时间
   * @param {*Number} rangeEndDate  时间戳、最右边请求的K线时间
   * @param {*Function} onDataCallback  回调函数
   * @param {*Function} onErrorCallback  回调函数
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
    const onLoadedCallback = (
      bars: IChart.Bar[],
      meta: IChart.HistoryMetadata
    ) => {
      if (bars.length && isFirstCall) {
        const key = `${symbolInfo.ticker}_${resolution}`
        this.lastBarEndTime[key] = Math.max(
          bars[bars.length - 1].time,
          this.lastBarEndTime[key] || 0
        )
      }
      this.debugLog('Datafeed bars length ', bars.length)
      onResult(bars, meta)
    }
    this.app.getBars(
      symbolInfo,
      resolution,
      rangeStartDate,
      rangeEndDate,
      onLoadedCallback,
      onError,
      isFirstCall,
      isSubscribe
    )
    this.debugLog('Datafeed getBars done.', {
      symbolInfo,
      resolution,
      rangeStartDate,
      rangeEndDate,
      isFirstCall,
      isSubscribe
    })
  }

  /**
   * 订阅K线数据。图表库将调用onRealtimeCallback方法以更新实时数据
   * @param {*Object} symbolInfo 商品信息
   * @param {*String} resolution 分辨率
   * @param {*Function} onRealtimeCallback 回调函数
   * @param {*String} subscriberUID 监听的唯一标识符
   * @param {*Function} onResetCacheNeededCallback (从1.7开始): 将在bars数据发生变化时执行
   */
  subscribeBars(
    symbolInfo: IChart.LibrarySymbolInfo,
    resolution: IChart.ResolutionString,
    onTick: IChart.SubscribeBarsCallback,
    listenerGuid: string,
    onResetCacheNeededCallback: () => void
  ) {
    this.barsPulseUpdater.subscribeDataListener(
      symbolInfo,
      resolution,
      onTick,
      listenerGuid
    )
    this.debugLog('Datafeed subscribeBars done.', listenerGuid)
  }

  /**
   * 取消订阅K线数据
   * @param {*String} subscriberUID 监听的唯一标识符
   */
  unsubscribeBars(subscriberUID: string) {
    this.barsPulseUpdater.unsubscribeDataListener(subscriberUID)
    this.debugLog('Datafeed unsubscribeBars done.', subscriberUID)
  }
}

export interface IDatafeed extends Datafeed {}
