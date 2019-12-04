export declare type ResolutionString = string;
export declare type ResolutionBackValues = 'D' | 'M';
export interface HistoryDepth {
  resolutionBack: ResolutionBackValues;
  intervalBack: number;
}
export interface LibrarySymbolInfo {
	/**
	 * Symbol Name
	 */
  name: string;
  full_name: string;
  base_name?: [string];
	/**
	 * Unique symbol id
	 */
  ticker?: string;
  description: string;
  type: string;
	/**
	 * @example "1700-0200"
	 */
  session: string;
	/**
	 * Traded exchange
	 * @example "NYSE"
	 */
  exchange: string;
  listed_exchange: string;
  timezone: string;
	/**
	 * Prices format: "price" or "volume"
	 */
  format: 'price' | 'volume';
	/**
	 * Code (Tick)
	 * @example 8/16/.../256 (1/8/100 1/16/100 ... 1/256/100) or 1/10/.../10000000 (1 0.1 ... 0.0000001)
	 */
  pricescale: number;
	/**
	 * The number of units that make up one tick.
	 * @example For example, U.S. equities are quotes in decimals, and tick in decimals, and can go up +/- .01. So the tick increment is 1. But the e-mini S&P futures contract, though quoted in decimals, goes up in .25 increments, so the tick increment is 25. (see also Tick Size)
	 */
  minmov: number;
  fractional?: boolean;
	/**
	 * @example Quarters of 1/32: pricescale=128, minmovement=1, minmovement2=4
	 */
  minmove2?: number;
	/**
	 * false if DWM only
	 */
  has_intraday?: boolean;
	/**
	 * An array of resolutions which should be enabled in resolutions picker for this symbol.
	 */
  supported_resolutions: ResolutionString[];
	/**
	 * @example (for ex.: "1,5,60") - only these resolutions will be requested, all others will be built using them if possible
	 */
  intraday_multipliers?: string[];
  has_seconds?: boolean;
	/**
	 * It is an array containing seconds resolutions (in seconds without a postfix) the datafeed builds by itself.
	 */
  seconds_multipliers?: string[];
  has_daily?: boolean;
  has_weekly_and_monthly?: boolean;
  has_empty_bars?: boolean;
  force_session_rebuild?: boolean;
  has_no_volume?: boolean;
	/**
	 * Integer showing typical volume value decimal places for this symbol
	 */
  volume_precision?: number;
  data_status?: 'streaming' | 'endofday' | 'pulsed' | 'delayed_streaming';
	/**
	 * Boolean showing whether this symbol is expired futures contract or not.
	 */
  expired?: boolean;
	/**
	 * Unix timestamp of expiration date.
	 */
  expiration_date?: number;
  sector?: string;
  industry?: string;
  currency_code?: string;
}
export interface IDatafeedQuotesApi {
  getQuotes(symbols: string[], onDataCallback: QuotesCallback, onErrorCallback: (msg: string) => void): void;
  subscribeQuotes(symbols: string[], fastSymbols: string[], onRealtimeCallback: QuotesCallback, listenerGUID: string): void;
  unsubscribeQuotes(listenerGUID: string): void;
}
export declare type QuotesCallback = (data: QuoteData[]) => void;
export declare type QuoteData = QuoteOkData | QuoteErrorData;
export interface QuoteErrorData {
  s: 'error';
  n: string;
  v: object;
}
export interface QuoteOkData {
  s: 'ok';
  n: string;
  v: DatafeedQuoteValues;
}
export interface DatafeedQuoteValues {
  ch?: number;
  chp?: number;
  short_name?: string;
  exchange?: string;
  description?: string;
  lp?: number;
  ask?: number;
  bid?: number;
  spread?: number;
  open_price?: number;
  high_price?: number;
  low_price?: number;
  prev_close_price?: number;
  volume?: number;
  original_name?: string;
  [valueName: string]: string | number | undefined;
}
export interface IExternalDatafeed {
  onReady(callback: OnReadyCallback): void;
}
export declare type OnReadyCallback = (configuration: DatafeedConfiguration) => void;
export interface DatafeedConfiguration {
  exchanges?: Exchange[];
  supported_resolutions?: ResolutionString[];
  supports_marks?: boolean;
  supports_time?: boolean;
  supports_timescale_marks?: boolean;
  symbols_types?: DatafeedSymbolType[];
}
export interface Exchange {
  value: string;
  name: string;
  desc: string;
}
export interface DatafeedSymbolType {
  name: string;
  value: string;
}
export declare type GetMarksCallback<T> = (marks: T[]) => void;
export interface Mark {
  id: string | number;
  time: number;
  color: MarkConstColors | MarkCustomColor;
  text: string;
  label: string;
  labelFontColor: string;
  minSize: number;
}
export declare type MarkConstColors = 'red' | 'green' | 'blue' | 'yellow';
export interface MarkCustomColor {
  color: string;
  background: string;
}
export interface TimescaleMark {
  id: string | number;
  time: number;
  color: MarkConstColors | string;
  label: string;
  tooltip: string[];
}
export declare type ServerTimeCallback = (serverTime: number) => void;

export declare const Datafeed: DatafeedConstructor;

export type IDatafeed = IBasicDataFeed | (IBasicDataFeed & IDatafeedQuotesApi);
export interface DatafeedConstructor {
  new(options: Options, datafeedURL?: string): IDatafeed;
}
export declare type IBasicDataFeed = IDatafeedChartApi & IExternalDatafeed;
export interface IDatafeedChartApi {
  calculateHistoryDepth?(resolution: ResolutionString, resolutionBack: ResolutionBackValues, intervalBack: number): HistoryDepth | undefined;
  getMarks?(symbolInfo: LibrarySymbolInfo, from: number, to: number, onDataCallback: GetMarksCallback<Mark>, resolution: ResolutionString): void;
  getTimescaleMarks?(symbolInfo: LibrarySymbolInfo, from: number, to: number, onDataCallback: GetMarksCallback<TimescaleMark>, resolution: ResolutionString): void;
	/**
	 * This function is called if configuration flag supports_time is set to true when chart needs to know the server time.
	 * The charting library expects callback to be called once.
	 * The time is provided without milliseconds. Example: 1445324591. It is used to display Countdown on the price scale.
	 */
  getServerTime?(callback: ServerTimeCallback): void;
  searchSymbols(userInput: string, exchange: string, symbolType: string, onResult: any): void;
  resolveSymbol(symbolName: string, onResolve: any, onError: any): void;
  getBars(symbolInfo: LibrarySymbolInfo, resolution: ResolutionString, rangeStartDate: number, rangeEndDate: number, onResult: any, onError: any, isFirstCall: boolean): void;
  subscribeBars(symbolInfo: LibrarySymbolInfo, resolution: ResolutionString, onTick: any, listenerGuid: string, onResetCacheNeededCallback: () => void): void;
  unsubscribeBars(listenerGuid: string): void;
  subscribeDepth?(symbol: string, callback: any): string;
  unsubscribeDepth?(subscriberUID: string): void;
  /**
   * 响应实时数据
   * @param data
   */
  updateData(data: GetBarsResult): void;
}
export interface GetBarsResult {
  bars: Bar[];
  meta: HistoryMetadata;
}
export interface HistoryMetadata {
  noData: boolean;
  nextTime?: number | null;
}
export interface UdfOkResponse extends UdfResponse {
  s: "ok";
}
export interface UdfResponse {
  s: string;
}

export interface UdfErrorResponse {
  s: "error";
  errmsg: string;
}

export interface UdfQuotesResponse extends UdfOkResponse {
  d: QuoteData[];
}
type ExchangeDataResponse = {
  symbol: string[];
} & {
    [K in keyof ExchangeDataResponseSymbolData]:
    | ExchangeDataResponseSymbolData[K]
    | NonNullable<ExchangeDataResponseSymbolData[K]>[];
  };
interface ExchangeDataResponseSymbolData {
  type: string;
  timezone: LibrarySymbolInfo["timezone"];
  description: string;

  "exchange-listed": string;
  "exchange-traded": string;

  "session-regular": string;

  fractional: boolean;

  pricescale: number;

  ticker?: string;

  minmov2?: number;
  minmove2?: number;

  minmov?: number;
  minmovement?: number;

  "force-session-rebuild"?: boolean;

  "supported-resolutions"?: string[];
  "intraday-multipliers"?: string[];

  "has-intraday"?: boolean;
  "has-daily"?: boolean;
  "has-weekly-and-monthly"?: boolean;
  "has-empty-bars"?: boolean;
  "has-no-volume"?: boolean;

  "volume-precision"?: number;
}

export interface Options {
  /**
   * history
   */
  history: (params: OptionHistory) => Promise<GetBarsResult>;
  /**
   * quotes
   */
  quotes?: (params: {
    symbols: string[];
  }) => Promise<UdfQuotesResponse | UdfErrorResponse>;
  /**
   * symbol_info
   */
  symbol_info?: (params: { group: string }) => Promise<ExchangeDataResponse>;
  /**
   * config
   */
  config?: () => Promise<UdfCompatibleConfiguration>;
  /**
   * time
   */
  time?: () => Promise<number>;
  /**
   * symbols
   */
  symbols?: (params: { symbol: string }) => Promise<LibrarySymbolInfo>;
  /**
   * marks
   */
  marks?: (params: OptionHistory) => Promise<Mark[]>;
  /**
   * timescale_marks
   */
  timescale_marks?: (params: OptionHistory) => Promise<TimescaleMark[]>;
  /**
   * search
   */
  search?: () => Promise<SearchSymbolResultItem[]>;
}

export interface SearchSymbolResultItem {
  symbol: string;
  full_name: string;
  description: string;
  exchange: string;
  ticker: string;
  type: string;
}
export interface OptionHistory {
  symbol: string;
  resolution: string;
  from: number;
  to: number;
}
export interface UdfCompatibleConfiguration extends DatafeedConfiguration {
  // tslint:disable:tv-variable-name
  supports_search?: boolean;
  supports_group_request?: boolean;
  // tslint:enable:tv-variable-name
}
export interface Bar {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}
