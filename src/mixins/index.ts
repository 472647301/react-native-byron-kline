import Vue from 'vue'
import enabled from '../config/enabled'
import Datafeed from '../utils/datafeed'
import Component from 'vue-class-component'
import * as options from '../config/options'
import { IDatafeed } from '../utils/datafeed'
import * as IChart from '../types/chart.min'
import overrides from '../config/overrides'
import disabled from '../config/disabled'

@Component
class MainMixin extends Vue {
  public datafeed: IDatafeed = new Datafeed(this)
  public widget?: IChart.IChartingLibraryWidget
  public klineData: Array<IChart.Bar> = []
  public isLoading: boolean = false
  public isDebug: boolean = false
  public symbol = 'BTC'
  public interval = '5'
  public pricescale = 100
  public awaitCount = 0
  public studyList: any = {}
  public datafeedConfig?: IChart.DatafeedConfiguration
  public symbolConfig?: IChart.LibrarySymbolInfo
  public optionsConfig?: IChart.ChartingLibraryWidgetOptions
  public imageUrl = ''

  /**
   * 返回datafeed配置
   */
  public returnConfig(): IChart.DatafeedConfiguration {
    const config = {}
    const _config = this.datafeedConfig
    return _config ? Object.assign(config, _config) : config
  }

  /**
   * 返回商品配置
   */
  public returnSymbol(): IChart.LibrarySymbolInfo {
    const _config = {
      name: this.symbol,
      ticker: this.symbol,
      description: this.symbol,
      pricescale: this.pricescale,
      volume_precision: 1,
      has_empty_bars: true
    }
    const config = this.symbolConfig
    return config ? Object.assign(_config, config) : _config
  }

  /**
   * 返回k线数据给图表
   */
  public async getBars(
    symbolInfo: IChart.LibrarySymbolInfo,
    resolution: IChart.ResolutionString,
    rangeStartDate: number,
    rangeEndDate: number,
    onResult: (bars: IChart.Bar[]) => void,
    onError: IChart.ErrorCallback,
    isFirstCall: boolean,
    isSubscribe: boolean
  ) {
    const data = this.klineData
    const toMs = rangeEndDate * 1000
    const fromMs = rangeStartDate * 1000
    if (this.interval !== resolution) {
      console.info(' >> 图表周期切换.')
      const notice = {
        event: 'switchingCycle',
        data: { old: this.interval, new: resolution }
      }
      this.interval = resolution
      this.postMessage(JSON.stringify(notice))
      this.fetchHistoryData(rangeEndDate, rangeStartDate)
      this.klineData = []
      this.isLoading = true
      const newData = await this.delayAwait()
      this.awaitCount = 0
      onResult(newData)
      return
    }
    if (isFirstCall && data.length) {
      console.info(' >> 已有历史数据渲染.')
      onResult(data)
      return
    }
    if (isFirstCall && !data.length && !this.awaitCount) {
      console.info(' >> 请求历史数据渲染.')
      this.fetchHistoryData(rangeEndDate, rangeStartDate)
      this.isLoading = true
      const newData = await this.delayAwait()
      this.awaitCount = 0
      onResult(newData)
      this.postMessage(JSON.stringify({ event: 'closeLoading' }))
      return
    }
    if (!isFirstCall && isSubscribe) {
      console.info(' >> 订阅实时数据渲染.')
      onResult(data)
      return
    }
    if (!isFirstCall && !isSubscribe && !this.awaitCount) {
      console.info(' >> 请求更多数据渲染.')
      if (this.isLoading) {
        //  正在请求中
        return
      }
      if (data && data.length) {
        const firstBar = data[0]
        if (
          (firstBar.time < toMs && fromMs < firstBar.time) ||
          firstBar.time > toMs
        ) {
          rangeEndDate = Math.floor(firstBar.time / 1000)
        }
      }
      const message = {
        event: 'fetchMoreData',
        data: {
          to: rangeEndDate,
          from: rangeStartDate,
          resolution: resolution,
          symbol: this.symbol
        }
      }
      this.postMessage(JSON.stringify(message))
      this.isLoading = true
      const newData = await this.delayAwait()
      this.awaitCount = 0
      onResult(newData)
      this.postMessage(JSON.stringify({ event: 'closeLoading' }))
    }
  }

  /**
   * 请求历史数据
   */
  public fetchHistoryData(to: number, from: number) {
    const message = {
      event: 'fetchHistoryData',
      data: {
        to: to,
        from: from,
        symbol: this.symbol,
        resolution: this.interval
      }
    }
    this.postMessage(JSON.stringify(message))
  }

  /**
   * 返回初始化配置
   */
  public returnOptions() {
    const _config = {
      locale: 'en',
      preset: 'mobile',
      fullscreen: true,
      library_path: './',
      symbol: this.symbol,
      debug: this.isDebug,
      overrides: overrides,
      interval: this.interval,
      datafeed: this.datafeed,
      timezone: 'Asia/Shanghai',
      enabled_features: enabled,
      disabled_features: disabled,
      container_id: 'tradingview',
      studies_overrides: options.studies,
      MA_Cross_style: options.cross,
      volume_style: options.volume
    }
    const config = this.optionsConfig
    return config ? Object.assign(_config, config) : _config
  }
  /**
   * 发送消息
   */
  public postMessage(message: string) {
    console.info(' >> 发送数据给RN:', message)
    if (typeof message !== 'string') {
      message = JSON.stringify(message)
    }
    const _w: any = window
    if (_w.ReactNativeWebView) {
      _w.ReactNativeWebView.postMessage(message)
    }
  }
  /**
   * 异步延迟等待
   */
  public delayAwait(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.awaitCount++
      console.info(` >> Await count: ${this.awaitCount * 300}ms`)
      if (!this.isLoading) {
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
   * 遍历k线数据
   */
  forEachKlineData(list: Array<IChart.Bar>) {
    const newCacheList = []
    for (let i = 0; i < list.length; i++) {
      newCacheList.push(list[i])
    }
    newCacheList.sort((l, r) => (l.time > r.time ? 1 : -1))
    // 请求断线时间段的历史数据
    // if (this.klineData.length) {
    //   const lastTime = this.klineData[this.klineData.length - 1].time
    //   const _lastTime = newCacheList[newCacheList.length - 1].time
    //   const seconCount = this.conversionSecon() * 1000
    //   console.info(' >> Last time:', lastTime, _lastTime, _lastTime - lastTime)
    //   if (_lastTime - lastTime > seconCount * 2) {
    //     // 请求更多数据
    //   }
    // }
    // 暂时不考虑
    return newCacheList
  }

  /**
   *  周期转换秒
   */
  public conversionSecon() {
    let seconCount = 0
    if (this.interval === 'D') {
      seconCount = 60 * 60 * 24
    } else if (this.interval === 'M') {
      seconCount = 60 * 60 * 24 * 31
    } else if (this.interval === 'W') {
      seconCount = 60 * 60 * 24 * 7
    } else {
      seconCount = 60 * Number(this.interval)
    }
    return seconCount
  }
}

export default MainMixin
