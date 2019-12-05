import * as TradingView from 'byron-kline-chart';
export declare function sendMessageToHtml(event: KLineNativeEvents, options: KLineOptions): string;
export declare function klineChartHtml(): string;
export interface KLineBar {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume?: number;
}
export interface KLineOptions {
    symbol?: string;
    interval?: string;
    debug?: boolean;
    locale?: TradingView.LanguageCode;
    pricescale?: number;
    librarySymbolInfo?: TradingView.LibrarySymbolInfo;
    datafeedConfiguration?: TradingView.DatafeedConfiguration;
    chartingLibraryWidgetOptions?: TradingView.ChartingLibraryWidgetOptions;
    kline?: Array<KLineBar>;
    type?: TradingView.SeriesStyle;
    studyName?: string;
    studyValue?: Array<number>;
    studyId?: string;
    studyPlot?: TradingView.CreateStudyOptions;
    event?: string;
    data?: any;
}
export interface KLineParams {
    symbol: string;
    resolution: string;
    from: number;
    to: number;
    isFirst?: boolean;
    oldResolution?: string;
}
export declare enum KLineNativeEvents {
    /**
     * 初始化
     */
    INIT = 0,
    /**
     * 历史数据处理
     */
    HISTORY = 1,
    /**
     * 订阅处理
     */
    SUBSCRIBE = 2,
    /**
     * 类型处理
     */
    TYPE = 3,
    /**
     * 指标处理
     */
    STUDY = 4,
    /**
     * 周期处理
     */
    INTERVAL = 5,
    /**
     * 创建截图
     */
    CREATE_SHOT = 6,
    /**
     * 移除截图
     */
    REMOVE_SHOT = 7,
    /**
     * DEFAULT
     */
    DEFAULT = 8
}
export declare enum KLineHtmlEvents {
    /**
     * 初始化完成
     */
    INIT_DONE = 0,
    /**
     * 获取历史数据
     */
    FETCH_HISTORY = 1,
    /**
     * 历史数据处理完成
     */
    HISTORY_DONE = 2,
    /**
     * 订阅数据处理完成
     */
    SUBSCRIBE_DONE = 3,
    /**
     * 类型处理完成
     */
    TYPE_DONE = 4,
    /**
     * 指标处理完成
     */
    STUDY_DONE = 5,
    /**
     * 周期处理完成
     */
    INTERVAL_DONE = 6,
    /**
     * 周期切换
     */
    INTERVAL_SWITCH = 7,
    /**
     * 创建截图完成
     */
    CREATE_SHOT_DONE = 8,
    /**
     * 移除截图完成
     */
    REMOVE_SHOT_DONE = 9
}
