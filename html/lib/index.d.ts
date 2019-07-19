declare type _event = 'initChart' | 'renderChartData' | 'renderChartSub' | 'changeChartType' | 'createChartStudy' | 'updateChartStudy' | 'changeChartResolution';
declare type _params = {
    symbol?: string;
    interval?: string;
    isDebug?: boolean;
    pricescale?: number;
    kline?: Array<Bar>;
    type?: number;
    studyName?: string;
    studyValue?: Array<number>;
};
export interface Bar {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume?: number;
}
declare type __event = 'fetchHistoryData' | 'fetchMoreData' | 'closeLoading' | 'switchingCycle';
declare type __data = {
    old?: string;
    new?: string;
    to?: number;
    from?: number;
    resolution?: string;
    symbol?: string;
};
export interface IOnMessage {
    event: __event;
    data: __data;
}
export declare function sendMessageHtml(name: _event, params: _params): string;
export {};
