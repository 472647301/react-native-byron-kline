type _event =
  | 'initChart'
  | 'renderChartData'
  | 'renderChartSub'
  | 'changeChartType'
  | 'createChartStudy'
  | 'updateChartStudy'
  | 'changeChartResolution'
type _params = {
  symbol?: string
  interval?: string
  isDebug?: boolean
  pricescale?: number
  kline?: Array<Bar>
  type?: number
  studyName?: string
  studyValue?: Array<number>
}

export interface Bar {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume?: number
}

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

export interface IOnMessage {
  event: __event
  data: __data
}

export function sendMessageHtml(name: _event, params: _params) {
  return `
  window.sendMessageHtml(${JSON.stringify({
    event: name,
    data: params
  })})
  `
}
