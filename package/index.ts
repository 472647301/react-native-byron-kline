import * as TradingView from 'byron-kline-chart'

export function sendMessageToHtml(event: KLineNativeEvents, options: KLineOptions) {
  return "\n  window.sendMessageToHtml(" + JSON.stringify({
    event: event,
    data: options
  }) + ")\n  ";
}

export function klineChartHtml() {
  return `
  <!DOCTYPE html><html lang=en dir=ltr><head><meta charset=utf-8><meta http-equiv=X-UA-Compatible content="IE=edge"><meta name=viewport content="width=device-width,initial-scale=1"><link type=text/css href=bundles/library.b9460c2b30f8433101d6.css rel=stylesheet><title>byron-kline</title><link href=css/app.8096f973.css rel=preload as=style><link href=js/app.54a1db8f.js rel=preload as=script><link href=js/chunk-vendors.d66d0e11.js rel=preload as=script><link href=css/app.8096f973.css rel=stylesheet></head><body class="chart-page unselectable on-widget"><noscript><strong>We're sorry but rn-tv doesn't work properly without JavaScript enabled. Please enable it to continue.</strong></noscript><div class=loading-indicator id=loading-indicator></div><script>var JSServer = {};
      var __initialEnabledFeaturesets = ["charting_library"];</script><div id=app></div><script src=js/chunk-vendors.d66d0e11.js></script><script src=js/app.54a1db8f.js></script></body></html>
  `
}

export interface KLineBar {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface KLineOptions {
  symbol?: string
  interval?: string
  debug?: boolean
  locale?: TradingView.LanguageCode
  pricescale?: number
  librarySymbolInfo?: TradingView.LibrarySymbolInfo
  datafeedConfiguration?: TradingView.DatafeedConfiguration
  chartingLibraryWidgetOptions?: TradingView.ChartingLibraryWidgetOptions
  kline?: Array<KLineBar>
  type?: TradingView.SeriesStyle
  studyName?: string
  studyValue?: Array<number>
  studyId?: string
  studyPlot?: TradingView.CreateStudyOptions
  event?: string
  data?: any
}

export interface KLineParams {
  symbol: string
  resolution: string
  from: number
  to: number
  isFirst?: boolean
  oldResolution?: string
}

export enum KLineNativeEvents {
  /**
   * 初始化
   */
  INIT,
  /**
   * 历史数据处理
   */
  HISTORY,
  /**
   * 订阅处理
   */
  SUBSCRIBE,
  /**
   * 类型处理
   */
  TYPE,
  /**
   * 指标处理
   */
  STUDY,
  /**
   * 周期处理
   */
  INTERVAL,
  /**
   * 创建截图
   */
  CREATE_SHOT,
  /**
   * 移除截图
   */
  REMOVE_SHOT,
  /**
   * DEFAULT
   */
  DEFAULT
}

export enum KLineHtmlEvents {
  /**
   * 初始化完成
   */
  INIT_DONE,
  /**
   * 获取历史数据
   */
  FETCH_HISTORY,
  /**
   * 历史数据处理完成
   */
  HISTORY_DONE,
  /**
   * 订阅数据处理完成
   */
  SUBSCRIBE_DONE,
  /**
   * 类型处理完成
   */
  TYPE_DONE,
  /**
   * 指标处理完成
   */
  STUDY_DONE,
  /**
   * 周期处理完成
   */
  INTERVAL_DONE,
  /**
   * 周期切换
   */
  INTERVAL_SWITCH,
  /**
   * 创建截图完成
   */
  CREATE_SHOT_DONE,
  /**
   * 移除截图完成
   */
  REMOVE_SHOT_DONE
}
