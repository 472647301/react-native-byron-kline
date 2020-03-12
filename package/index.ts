import * as TradingView from 'byron-kline-chart'

export function sendMessageToHtml(event: KLineNativeEvents, options: KLineOptions) {
  return "\n  window.sendMessageToHtml(" + JSON.stringify({
    event: event,
    data: options
  }) + ");\n  true;";
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
  isFirst: boolean
  oldResolution?: string
}

export enum KLineNativeEvents {
  /**
   * 初始化
   */
  INIT = 'INIT',
  /**
   * 历史数据处理
   */
  HISTORY = 'HISTORY',
  /**
   * 订阅处理
   */
  SUBSCRIBE = 'SUBSCRIBE',
  /**
   * 类型处理
   */
  TYPE = 'TYPE',
  /**
   * 指标处理
   */
  STUDY = 'STUDY',
  /**
   * 周期处理
   */
  INTERVAL = 'INTERVAL',
  /**
   * 创建截图
   */
  CREATE_SHOT = 'CREATE_SHOT',
  /**
   * 移除截图
   */
  REMOVE_SHOT = 'REMOVE_SHOT',
  /**
   * DEFAULT
   */
  DEFAULT = 'DEFAULT'
}

export enum KLineHtmlEvents {
  /**
    * 初始化完成
    */
  INIT_DONE = 'INIT_DONE',
  /**
   * 获取历史数据
   */
  FETCH_HISTORY = 'FETCH_HISTORY',
  /**
   * 历史数据处理完成
   */
  HISTORY_DONE = 'HISTORY_DONE',
  /**
   * 订阅数据处理完成
   */
  SUBSCRIBE_DONE = 'SUBSCRIBE_DONE',
  /**
   * 类型处理完成
   */
  TYPE_DONE = 'TYPE_DONE',
  /**
   * 指标处理完成
   */
  STUDY_DONE = 'STUDY_DONE',
  /**
   * 周期处理完成
   */
  INTERVAL_DONE = 'INTERVAL_DONE',
  /**
   * 周期切换
   */
  INTERVAL_SWITCH = 'INTERVAL_SWITCH',
  /**
   * 创建截图完成
   */
  CREATE_SHOT_DONE = 'CREATE_SHOT_DONE',
  /**
   * 移除截图完成
   */
  REMOVE_SHOT_DONE = 'REMOVE_SHOT_DONE'
}
