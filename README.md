# react-native-byron-kline

基于TradingView的 react-native k线图表

- [TradingView api](https://b.aitrade.ga/books/tradingview/)
- [完整案例Example](https://github.com/472647301/ReactNativeKLine/blob/master/App.tsx)

## 用法
`$ yarn add byron-kline --save`

```javascript
import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Platform,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import {WebView, WebViewMessageEvent} from 'react-native-webview';
import {KLineHtmlEvents, KLineParams} from 'byron-kline';
import {sendMessageToHtml, KLineNativeEvents, KLineBar} from 'byron-kline';
import * as Config from './config';
import axios from 'axios';

type Props = {};
type State = {
  loading: boolean;
  interval: Config.IntervalT;
};
export default class App extends React.Component<Props, State> {
  private chart: WebView | null = null;
  private ws: WebSocket;
  private klineId?: number;

  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      interval: 15,
    };
    this.ws = new WebSocket('wss://sock.xyt.com/ws');
    this.ws.onmessage = (event) => {
      const json = JSON.parse(event.data);
      if (json.send === 'scale') {
        this.onWsMessage(json.data);
      }
    };
  }

  public onWsMessage = (data: ISubData) => {
    // console.log('---onWsMessage---', data);
    const {interval} = this.state;
    if (!this.chart || !data) {
      return;
    }
    if (data.t !== Config.INTERVAL_SERVER[interval]) {
      return;
    }
    this.chart.injectJavaScript(
      sendMessageToHtml(KLineNativeEvents.SUBSCRIBE, {
        kline: [
          {
            time: data.i * 1000,
            open: data.o,
            high: data.h,
            low: data.l,
            close: data.c,
            volume: data.v,
          },
        ],
      }),
    );
  };

  /**
   * 获取数据
   */
  public fetchScaleData = async (params: IParams) => {
    const res = await axios.post<{data: Array<IGetData>}>(
      'https://www.xyt.com/api/market/getScaleByDate',
      params,
    );
    const list: KLineBar[] = [];
    if (!res || !res.data || !res.data.data.length) {
      return list;
    }
    this.klineId = res.data.data[0].id;
    for (let i = 0; i < res.data.data.length; i++) {
      const e = res.data.data[i];
      list.push({
        time: e.id * 1000,
        open: e.open,
        high: e.high,
        low: e.low,
        close: e.close,
        volume: e.volume,
      });
    }
    list.sort((l, r) => (l.time > r.time ? 1 : -1));
    return list;
  };

  /**
   * 切换周期
   */
  public onChangeInterval = (key: string) => {
    const {interval} = this.state;
    if (!this.chart || interval === Number(key)) {
      return;
    }
    if (!interval) {
      this.chart.injectJavaScript(
        sendMessageToHtml(KLineNativeEvents.TYPE, {
          type: 1,
        }),
      );
    }
    if (!Number(key)) {
      this.chart.injectJavaScript(
        sendMessageToHtml(KLineNativeEvents.TYPE, {
          type: 2,
        }),
      );
    }
    this.ws.send(
      JSON.stringify({
        unsubscribe: 'scale',
        data: {
          symbol: 'btcusdt',
          type: Config.INTERVAL_SERVER[interval],
        },
      }),
    );
    this.chart.injectJavaScript(
      sendMessageToHtml(KLineNativeEvents.INTERVAL, {
        interval: Config.INTERVAL[Number(key) as Config.IntervalT],
      }),
    );
    this.setState({
      interval: Number(key) as Config.IntervalT,
    });
  };

  /**
   * 图表加载
   */
  public onChartLoadEnd = () => {
    if (!this.chart) {
      return;
    }
    const {interval} = this.state;
    const msg = sendMessageToHtml(KLineNativeEvents.INIT, {
      debug: true,
      symbol: 'btcusdt',
      interval: Config.INTERVAL[interval],
      pricescale: 100,
      librarySymbolInfo: Config.librarySymbolInfo,
      datafeedConfiguration: Config.datafeedConfig,
      chartingLibraryWidgetOptions: Config.chartingLibraryWidgetOptions,
    });
    this.chart.injectJavaScript(msg);
  };

  /**
   * 监听 WebView
   */
  public onWebViewMessage = (e: WebViewMessageEvent) => {
    try {
      const msg = JSON.parse(e.nativeEvent.data);
      if (msg && msg.event) {
        this.onChartMessage(msg.event, msg.data || {});
      }
    } catch (e) {
      console.log(e);
    }
  };

  /**
   * 监听图表事件
   */
  public onChartMessage = async (
    event: KLineHtmlEvents,
    params: KLineParams,
  ) => {
    if (!this.chart) {
      return;
    }
    const {interval} = this.state;
    switch (event) {
      case KLineHtmlEvents.INIT_DONE:
        console.log(' >> onChartMessage:', '初始化完成');
        break;
      case KLineHtmlEvents.FETCH_HISTORY:
        console.log(' >> onChartMessage:', '获取历史数据');
        const bars = await this.fetchScaleData({
          ...Config.KLineIntervalResult(interval, this.klineId),
          type: Config.INTERVAL_SERVER[interval],
          symbol: 'btcusdt',
        });
        this.chart.injectJavaScript(
          sendMessageToHtml(KLineNativeEvents.HISTORY, {
            kline: bars,
          }),
        );
        break;
      case KLineHtmlEvents.HISTORY_DONE:
        console.log(' >> onChartMessage:', '历史数据处理完成');
        if (params.isFirst) {
          this.ws.send(
            JSON.stringify({
              subscribe: 'scale',
              data: {
                symbol: 'btcusdt',
                type: Config.INTERVAL_SERVER[interval],
              },
            }),
          );
        }
        break;
      case KLineHtmlEvents.INTERVAL_SWITCH:
        console.log(' >> onChartMessage:', '周期切换');
        break;
      case KLineHtmlEvents.INTERVAL_DONE:
        console.log(' >> onChartMessage:', '周期处理完成');
        break;
      case KLineHtmlEvents.CREATE_SHOT_DONE:
        console.log(' >> onChartMessage:', '创建截图完成');
        break;
      case KLineHtmlEvents.TYPE_DONE:
        console.log(' >> onChartMessage:', '类型处理完成');
        break;
    }
  };

  /**
   * 创建指标
   */
  public createChartStudy = () => {
    if (!this.chart) {
      return;
    }
    this.chart.injectJavaScript(
      sendMessageToHtml(KLineNativeEvents.DEFAULT, {
        event: 'chart',
        data: {event: 'removeAllStudies'},
      }),
    );
    this.chart.injectJavaScript(
      sendMessageToHtml(KLineNativeEvents.STUDY, {
        studyName: 'Volume',
      }),
    );
    const arr = [5, 10, 30, 60];
    for (let i = 0; i < arr.length; i++) {
      const study = sendMessageToHtml(KLineNativeEvents.STUDY, {
        studyName: 'Moving Average',
        studyValue: [arr[i]],
        // studyPlot: options.study_plot[key]
      });
      this.chart.injectJavaScript(study);
    }
  };

  public render() {
    let source;
    if (Platform.OS === 'ios') {
      source = require('byron-kline/dist/index.html');
    } else {
      const uri = 'file:///android_asset/raw/';
      const dist = 'node_modules_byronkline_dist_index.html';
      source = {uri: `${uri}${dist}`};
    }
    const {interval} = this.state;
    return (
      <SafeAreaView style={styles.app}>
        <WebView
          source={source}
          style={styles.app}
          originWhitelist={['*']}
          ref={(ref) => (this.chart = ref)}
          onMessage={this.onWebViewMessage}
          onLoadEnd={this.onChartLoadEnd}
        />
        <View style={styles.footer}>
          {Object.keys(Config.INTERVAL).map((e) => {
            const isActive = interval === Number(e);
            return (
              <TouchableOpacity
                key={e}
                style={styles.footer_item}
                onPress={() => this.onChangeInterval(e)}>
                <Text
                  style={[
                    styles.footer_text,
                    isActive && styles.footer_text_active,
                  ]}>
                  {Config.INTERVAL_NAME[Number(e) as Config.IntervalT]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    );
  }
}

```

![kline_view](https://github.com/472647301/ReactNativeKLine/blob/master/btcusdt.png?raw=true)
