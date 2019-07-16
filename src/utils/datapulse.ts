import { IDatafeed } from './datafeed'
import * as IChart from '../types/chart.min'

interface ISubscriber {
  symbolInfo: IChart.LibrarySymbolInfo
  resolution: IChart.ResolutionString
  lastBarTime?: number
  listeners: Array<IChart.SubscribeBarsCallback>
}

export default class DataPulse {
  public datafeed: IDatafeed
  public subscribers: { [key: string]: ISubscriber }
  public requestsPending: number

  constructor(datafeed: IDatafeed) {
    this.datafeed = datafeed
    this.subscribers = {}
    this.requestsPending = 0
    this.datafeed.debugLog('DataPulse init done.')
  }

  public update() {
    if (this.requestsPending > 0) return
    for (let key in this.subscribers) {
      this.datafeed.debugLog('DataPulse update ', key)
      let lastBarEndTime = 0
      const subscriptionRecord = this.subscribers[key]
      const resolution = subscriptionRecord.resolution
      const datesRangeRight = Math.ceil(new Date().getTime() / 1000)
      let datesRangeLeft =
        datesRangeRight - this.periodLengthSeconds(resolution, 10)
      this.requestsPending++
      const lastKey = `${subscriptionRecord.symbolInfo.ticker}_${resolution}`
      if (this.datafeed.lastBarEndTime[lastKey]) {
        lastBarEndTime = this.datafeed.lastBarEndTime[lastKey]
        datesRangeLeft = Math.min(
          datesRangeLeft,
          Math.floor(lastBarEndTime / 1000)
        )
      }
      if (!subscriptionRecord.lastBarTime && lastBarEndTime) {
        this.subscribers[key].lastBarTime = lastBarEndTime
      }
      const onResult = (bars: IChart.Bar[], meta: IChart.HistoryMetadata) => {
        this.requestsPending--
        if (!bars.length) return
        const lastBar = bars[bars.length - 1]
        if (
          subscriptionRecord.lastBarTime &&
          lastBar.time < subscriptionRecord.lastBarTime
        ) {
          return
        }
        const subscribers = subscriptionRecord.listeners
        for (let i = 0; i < bars.length; i++) {
          const bar = bars[i]
          if (
            subscriptionRecord.lastBarTime &&
            bar.time >= subscriptionRecord.lastBarTime
          ) {
            this.subscribers[key].lastBarTime = bar.time
            for (let k = 0; k < subscribers.length; k++) {
              subscribers[k](bar)
            }
          }
        }
      }
      this.datafeed.getBars(
        subscriptionRecord.symbolInfo,
        resolution,
        datesRangeLeft,
        datesRangeRight,
        onResult,
        () => this.requestsPending--,
        false,
        true
      )
    }
  }

  public subscribeDataListener(
    symbolInfo: IChart.LibrarySymbolInfo,
    resolution: IChart.ResolutionString,
    onTick: IChart.SubscribeBarsCallback,
    listenerGuid: string
  ) {
    if (!this.subscribers[listenerGuid]) {
      this.subscribers[listenerGuid] = {
        symbolInfo: symbolInfo,
        resolution: resolution,
        listeners: []
      }
    }
    this.subscribers[listenerGuid].listeners.push(onTick)
    this.datafeed.debugLog('DataPulse push ', listenerGuid)
  }

  public unsubscribeDataListener(listenerGUID: string) {
    if (this.subscribers[listenerGUID]) {
      delete this.subscribers[listenerGUID]
    }
    this.datafeed.debugLog('DataPulse delete ', listenerGUID)
  }

  public periodLengthSeconds(resolution: string, requiredPeriodsCount: number) {
    let daysCount = 0
    if (resolution === 'D') {
      daysCount = requiredPeriodsCount
    } else if (resolution === 'M') {
      daysCount = 31 * requiredPeriodsCount
    } else if (resolution === 'W') {
      daysCount = 7 * requiredPeriodsCount
    } else {
      daysCount = (requiredPeriodsCount * Number(resolution)) / (24 * 60)
    }
    this.datafeed.debugLog('DataPulse period ', daysCount * 24 * 60 * 60)
    return daysCount * 24 * 60 * 60
  }
}

export interface IDataPulse extends DataPulse {}
