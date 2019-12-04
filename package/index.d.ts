
import * as TradingView from 'byron-kline-chart'

export interface Bar {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export declare type IMsgData = {
  symbol?: string
  interval?: string
  debug?: boolean
  locale?: TradingView.LanguageCode
  pricescale?: number
  librarySymbolInfo?: TradingView.LibrarySymbolInfo
  datafeedConfiguration?: TradingView.DatafeedConfiguration
  chartingLibraryWidgetOptions?: TradingView.ChartingLibraryWidgetOptions
  kline?: Array<Bar>
  type?: TradingView.SeriesStyle
  studyName?: string
  studyValue?: Array<number>
  studyId?: string
  studyPlot?: TradingView.CreateStudyOptions
  event?: string
  data?: any
}

export declare type IParams = {
  symbol: string
  resolution: string
  from: number
  to: number
  isFirst?: boolean
  oldResolution?: string
}

export declare const enum IEvents {
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
   * 初始化完成
   */
  INIT_DONE,
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
  REMOVE_SHOT_DONE,
  /**
   * DEFAULT
   */
  DEFAULT
}

export declare function sendMessageToHtml(name: IEvents, params: IMsgData): string
export declare function byronKLineHtml(): string
export { }