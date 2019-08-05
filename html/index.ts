type _event =
  | 'initChart'
  | 'renderChartData'
  | 'renderChartMoreData'
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
  symbolConfig?: LibrarySymbolInfo
  optionsConfig?: ChartingLibraryWidgetOptions
  datafeedConfig?: DatafeedConfiguration
}
export interface DatafeedConfiguration {
  exchanges?: Exchange[]
  supported_resolutions?: string[]
  supports_marks?: boolean
  supports_time?: boolean
  supports_timescale_marks?: boolean
  symbols_types?: DatafeedSymbolType[]
}

export interface Exchange {
  value: string
  name: string
  desc: string
}
export interface DatafeedSymbolType {
  name: string
  value: string
}
export interface ChartingLibraryWidgetOptions {
  container_id?: string
  interval?: string
  symbol?: string
  auto_save_delay?: number
  autosize?: boolean
  debug?: boolean
  disabled_features?: string[]
  enabled_features?: string[]
  fullscreen?: boolean
  height?: number
  library_path?: string
  saved_data?: object
  study_count_limit?: number
  symbol_search_request_delay?: number
  timeframe?: string
  timezone?: 'exchange' | Timezone
  toolbar_bg?: string
  width?: number
  charts_storage_url?: string
  client_id?: string
  user_id?: string
  load_last_chart?: boolean
  studies_overrides?: any
  customFormatters?: any
  overrides?: any
  snapshot_url?: string
  indicators_file_name?: string
}
export declare type Timezone = 'Etc/UTC' | CustomTimezones
export declare type CustomTimezones =
  | 'America/New_York'
  | 'America/Los_Angeles'
  | 'America/Chicago'
  | 'America/Phoenix'
  | 'America/Toronto'
  | 'America/Vancouver'
  | 'America/Argentina/Buenos_Aires'
  | 'America/El_Salvador'
  | 'America/Sao_Paulo'
  | 'America/Bogota'
  | 'America/Caracas'
  | 'Europe/Moscow'
  | 'Europe/Athens'
  | 'Europe/Belgrade'
  | 'Europe/Berlin'
  | 'Europe/London'
  | 'Europe/Luxembourg'
  | 'Europe/Madrid'
  | 'Europe/Paris'
  | 'Europe/Rome'
  | 'Europe/Warsaw'
  | 'Europe/Istanbul'
  | 'Europe/Zurich'
  | 'Australia/Sydney'
  | 'Australia/Brisbane'
  | 'Australia/Adelaide'
  | 'Australia/ACT'
  | 'Asia/Almaty'
  | 'Asia/Ashkhabad'
  | 'Asia/Tokyo'
  | 'Asia/Taipei'
  | 'Asia/Singapore'
  | 'Asia/Shanghai'
  | 'Asia/Seoul'
  | 'Asia/Tehran'
  | 'Asia/Dubai'
  | 'Asia/Kolkata'
  | 'Asia/Hong_Kong'
  | 'Asia/Bangkok'
  | 'Asia/Chongqing'
  | 'Asia/Jerusalem'
  | 'Asia/Kuwait'
  | 'Asia/Muscat'
  | 'Asia/Qatar'
  | 'Asia/Riyadh'
  | 'Pacific/Auckland'
  | 'Pacific/Chatham'
  | 'Pacific/Fakaofo'
  | 'Pacific/Honolulu'
  | 'America/Mexico_City'
  | 'Africa/Cairo'
  | 'Africa/Johannesburg'
  | 'Asia/Kathmandu'
  | 'US/Mountain'
  | 'Europe/Helsinki'
  | 'Europe/Stockholm'
  | 'Europe/Copenhagen'
  | 'Atlantic/Reykjavik'
  | 'Europe/Tallinn'
  | 'Europe/Riga'
  | 'Europe/Vilnius'
  | 'America/Lima'
  | 'America/Santiago'
  | 'Asia/Bahrain'
  | 'Asia/Jakarta'
  | 'Africa/Lagos'
  | 'Pacific/Norfolk'
  | 'America/Juneau'
  | 'Asia/Ho_Chi_Minh'
  | 'Australia/Perth'
  | 'Europe/Oslo'
export interface LibrarySymbolInfo {
  /**
   * Symbol Name
   */
  name?: string
  full_name?: string
  base_name?: [string]
  /**
   * Unique symbol id
   */
  ticker?: string
  description?: string
  type?: string
  /**
   * @example "1700-0200"
   */
  session?: string
  /**
   * Traded exchange
   * @example "NYSE"
   */
  exchange?: string
  listed_exchange?: string
  timezone?: Timezone
  /**
   * Code (Tick)
   * @example 8/16/.../256 (1/8/100 1/16/100 ... 1/256/100) or 1/10/.../10000000 (1 0.1 ... 0.0000001)
   */
  pricescale?: number
  /**
   * The number of units that make up one tick.
   * @example For example, U.S. equities are quotes in decimals, and tick in decimals, and can go up +/- .01. So the tick increment is 1. But the e-mini S&P futures contract, though quoted in decimals, goes up in .25 increments, so the tick increment is 25. (see also Tick Size)
   */
  minmov?: number
  fractional?: boolean
  /**
   * @example Quarters of 1/32: pricescale=128, minmovement=1, minmovement2=4
   */
  minmove2?: number
  /**
   * false if DWM only
   */
  has_intraday?: boolean
  /**
   * An array of resolutions which should be enabled in resolutions picker for this symbol.
   */
  supported_resolutions?: string[]
  /**
   * @example (for ex.: "1,5,60") - only these resolutions will be requested, all others will be built using them if possible
   */
  intraday_multipliers?: string[]
  has_seconds?: boolean
  /**
   * It is an array containing seconds resolutions (in seconds without a postfix) the datafeed builds by itself.
   */
  seconds_multipliers?: string[]
  has_daily?: boolean
  has_weekly_and_monthly?: boolean
  has_empty_bars?: boolean
  force_session_rebuild?: boolean
  has_no_volume?: boolean
  /**
   * Integer showing typical volume value decimal places for this symbol
   */
  volume_precision?: number
  data_status?: 'streaming' | 'endofday' | 'pulsed' | 'delayed_streaming'
  /**
   * Boolean showing whether this symbol is expired futures contract or not.
   */
  expired?: boolean
  /**
   * Unix timestamp of expiration date.
   */
  expiration_date?: number
  sector?: string
  industry?: string
  currency_code?: string
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

type IChartingLibraryWidget =
  | 'chart'
  | 'setLanguage'
  | 'setSymbol'
  | 'remove'
  | 'save'
  | 'load'
  | 'symbolInterval'
  | 'changeTheme'

export interface IOnMessage {
  event: __event
  data: __data
}

export function sendMessageHtml(
  name: _event & IChartingLibraryWidget,
  params: _params
) {
  return `
  window.sendMessageHtml(${JSON.stringify({
    event: name,
    data: params
  })})
  `
}
