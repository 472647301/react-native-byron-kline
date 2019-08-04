# react-native-byron-kline

基于TradingView的 react-native k线图表

- [TradingView api](https://b.aitrade.ga/books/tradingview/)
- [完整案例Example](https://github.com/472647301/react-native-inssues/blob/master/src/views/WebView.tsx)

## 用法
`$ yarn add react-native-byron-kline --save`

```javascript
import { WebView } from 'react-native-webview'
import { sendMessageHtml, IOnMessage } from 'react-native-byron-kline'

class WebViewScreen extends React.Component {
  public chart: WebView | null = null
  
  public onLoadEnd() {
    if (this.chart) {
      const msg = sendMessageHtml('initChart', {
        symbol: 'btcusdt',
        interval: '5',
        pricescale: 100,
        isDebug: true,
        datafeedConfig: {}, // 具体参数请查看types/chart.min.d.ts里面DatafeedConfiguration接口，或teadingview api
        optionsConfig: {},  // 具体参数请查看types/chart.min.d.ts里面ChartingLibraryWidgetOptions接口，或teadingview api
        symbolConfig: {} // 具体参数请查看types/chart.min.d.ts里面LibrarySymbolInfo接口，或teadingview api
      })
      this.chart.injectJavaScript(msg)
    }
  }
  
  public onMessage(data: string) {
    const msg: IOnMessage = JSON.parse(data)
    switch (msg.event) {
      case 'fetchHistoryData':
        // 请求历史数据
        // 返回历史数据给图表
      break
      case 'fetchMoreData':
        // 请求更多数据
        // 当图表左滑需要更多数据时会响应该事件给rn
      break
      case 'closeLoading':
        // 图表库渲染数据完成
        // 可以在此执行关闭loading（rn视图的）等事件
      break
      case 'switchingCycle':
        // 图表库切换周期
      break
    }
  }
  
  public render() {
    return (
      <View style={{ flex: 1 }}>
        <WebView
          style={{ flex: 1 }}
          originWhitelist={['*']}
          ref={ref => (this.chart = ref)}
          source={require('react-native-byron-kline/dist/index.html')}
          onMessage={evt => this.onMessage(evt.nativeEvent.data)}
          onLoadEnd={this.onLoadEnd.bind(this)}
         />
      </View>
    )
  }
}

```

![kline_view](https://github.com/472647301/react-native-inssues/blob/master/screenshots/kline_view.jpg?raw=true)
![kline_ide_1](https://github.com/472647301/react-native-inssues/blob/master/screenshots/kline_ide_1.jpg?raw=true)
![kline_ide_2](https://github.com/472647301/react-native-inssues/blob/master/screenshots/kline_ide_2.jpg?raw=true)
