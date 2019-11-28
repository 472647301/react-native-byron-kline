export const disabled = [
  'border_around_the_chart',
  'use_localstorage_for_settings',
  'header_symbol_search',
  'timeframes_toolbar',
  'header_chart_type', // 隐藏k线样式选择
  'volume_force_overlay',
  'header_saveload',
  'header_resolutions',
  'header_compare',
  'header_undo_redo',
  'header_screenshot',
  'display_market_status',
  'show_chart_property_page',
  'show_logo_on_all_charts',
  'control_bar',
  'hide_last_na_study_output',
  'header_widget',
  'context_menus',// 隐藏右键上下文'
  'source_selection_markers'// 禁用k线选择后小标记
]

export const enabled = [
  'hide_last_na_study_output'
]

export const studies = {
  'volume.volume.color.0': '#cb4848',
  'volume.volume.color.1': '#01bd8b',
  'volume.volume.transparency': 50,
  'MACD.MACD.linewidth': 4, // macd线线宽
  'MACD.MACD.color': '#1c65a6', // macd线颜色
  'MACD.Signal.color': '#cc4a4a', // macd信号线线颜色
  'MACD.Signal.linewidth': 4, // macd信号线宽
  'MACD.Histogram.linewidth': 4, // macd柱状图宽
}

export const cross = {
  'short:plot.color': '#f103f2',
  'long:plot.color': '#fff900'
}

export const volume = {
  'volume.color.0': 'rgba(234,0,112,0.6)',
  'volume.color.1': 'rgba(112,168,0,0.6)'
}

export const overrides = {
  'volumePaneSize': 'medium', // 支持的值: large, medium, small, tiny
  'timeScale.rightOffset': 10,
  'mainSeriesProperties.style': 1,
  'paneProperties.background': '#12151c',
  'scalesProperties.backgroundColor': '#12151c',
  'scalesProperties.textColor': '#cdcdcd',
  'scalesProperties.lineColor': '#4c5052',
  'paneProperties.vertGridProperties.color': '#12151c',
  'paneProperties.horzGridProperties.color': '#12151c',
  'mainSeriesProperties.candleStyle.upColor': '#70a800',
  'mainSeriesProperties.candleStyle.borderUpColor': '#70a800',
  'mainSeriesProperties.candleStyle.wickUpColor': '#70a800',
  'mainSeriesProperties.candleStyle.downColor': '#ea0070',
  'mainSeriesProperties.candleStyle.borderDownColor': '#ea0070',
  'mainSeriesProperties.candleStyle.wickDownColor': '#ea0070',
  'volume.color.0': 'rgba(234,0,112,0.6)',
  'volume.color.1': 'rgba(112,168,0,0.6)',
  'paneProperties.legendProperties.showLegend': false
}