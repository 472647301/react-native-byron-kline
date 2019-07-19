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
  public symbol = 'BTC'
  public interval = '5'
  public pricescale = 100
  public awaitCount = 0
  public studyList: any = {}

  /**
   * 返回datafeed配置
   */
  public returnConfig(): IChart.DatafeedConfiguration {
    return {}
  }

  /**
   * 返回商品配置
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
   * 返回k线数据给图表
   */
  public async getBars(
    symbolInfo: IChart.LibrarySymbolInfo,
    resolution: IChart.ResolutionString,
    rangeStartDate: number,
    rangeEndDate: number,
    onResult: IChart.HistoryCallback,
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
      const newData = await this.delayAwait()
      this.awaitCount = 0
      if (newData && newData.length) {
        onResult(newData, { noData: false })
      } else {
        onResult([], { noData: true })
      }
      return
    }
    if (isFirstCall && data.length) {
      console.info(' >> 已有历史数据渲染.')
      onResult(data, { noData: false })
      return
    }
    if (isFirstCall && !data.length) {
      console.info(' >> 请求历史数据渲染.')
      this.fetchHistoryData(rangeEndDate, rangeStartDate)
      const newData = await this.delayAwait()
      this.awaitCount = 0
      if (newData && newData.length) {
        onResult(newData, { noData: false })
        this.postMessage(JSON.stringify({ event: 'closeLoading' }))
      } else {
        onResult([], { noData: true })
      }
      return
    }
    if (!isFirstCall && isSubscribe) {
      console.info(' >> 订阅实时数据渲染.')
      onResult(data, { noData: false })
      return
    }
    if (!isFirstCall && !isSubscribe) {
      console.info(' >> 请求更多数据渲染.')
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
      const newData = await this.delayAwait()
      this.awaitCount = 0
      if (newData && newData.length) {
        onResult(newData, { noData: false })
      } else {
        onResult([], { noData: true })
      }
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
      if (this.klineData.length) {
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
    const cacheData = this.klineData
    let ci = 0
    let lastTime = 0
    let cl = cacheData.length
    for (let i = list.length - 1; i >= 0; i--) {
      const item = list[i]
      if (item.time < lastTime) continue
      while (ci < cl) {
        const cItem = cacheData[ci]
        if (cItem.time > item.time) {
          break
        } else if (cItem.time < item.time) {
          lastTime = cItem.time
          newCacheList.push(cItem)
          ci++
        } else {
          ci++
          break
        }
      }
      if (item.time > lastTime) {
        lastTime = item.time
        newCacheList.push(item)
      } else {
        newCacheList[newCacheList.length - 1] = item
      }
      if (i === 0) {
        while (ci < cl) {
          const cItem = cacheData[ci]
          if (cItem.time > lastTime) {
            lastTime = cItem.time
            newCacheList.push(cItem)
            ci++
          }
        }
      }
    }
    newCacheList.sort((l, r) => (l.time > r.time ? 1 : -1))
    return newCacheList
  }
}

export default MainMixin
