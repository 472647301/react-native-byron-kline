type __event =
  | 'fetchHistoryData'
  | 'fetchMoreData'
  | 'closeLoading'
  | 'switchingCycle'
type __data = {
  old?: string
  new?: string
  to?: number
  from?: number
  resolution?: string
  symbol?: string
}
import axios from 'axios'
import moment from 'moment'

export default {
  postMessage: function(message: string) {
    const data: { event: __event; data: __data } = JSON.parse(message)
    switch (data.event) {
      case 'fetchHistoryData':
        this.fetchHistoryData(data.data)
        break
      case 'fetchMoreData':
        this.fetchMoreData(data.data)
    }
  },
  fetchHistoryData: async function(data: __data) {
    const params = {
      symbol: data.symbol,
      type: `MIN_${data.resolution}`,
      from: data.from,
      to: data.to
    }
    const res = await axios.post('/v1/exchange/ticker/getScaleByDate', params)
    if (res && res.data && res.data.data) {
      const list: Array<any> = []
      res.data.data.forEach((item: any) => {
        item.time =
          Number(moment(item.date, 'YYYY-MM-DD HH:mm:ss').format('X')) * 1000
        list.push(item)
      })
      if (this.sendMessageHtml) {
        const sd = this.sendMessageHtml as any
        sd({
          event: 'renderChartData',
          data: { kline: list }
        })
      }
    }
  },
  fetchMoreData: async function(data: __data) {
    const params = {
      symbol: data.symbol,
      type: `MIN_${data.resolution}`,
      from: data.from,
      to: data.to
    }
    const res = await axios.post('/v1/exchange/ticker/getScaleByDate', params)
    if (res && res.data && res.data.data) {
      const list: Array<any> = []
      res.data.data.forEach((item: any) => {
        item.time =
          Number(moment(item.date, 'YYYY-MM-DD HH:mm:ss').format('X')) * 1000
        list.push(item)
      })
      if (this.sendMessageHtml) {
        const sd = this.sendMessageHtml as any
        sd({
          event: 'renderChartMoreData',
          data: { kline: list }
        })
      }
    }
  },
  sendMessageHtml: null
}
