"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sendMessageToHtml(event, options) {
    return "\n  window.sendMessageToHtml(" + JSON.stringify({
        event: event,
        data: options
    }) + ")\n  ";
}
exports.sendMessageToHtml = sendMessageToHtml;
function klineChartHtml() {
    return "\n  <!DOCTYPE html><html lang=en dir=ltr><head><meta charset=utf-8><meta http-equiv=X-UA-Compatible content=\"IE=edge\"><meta name=viewport content=\"width=device-width,initial-scale=1\"><link type=text/css href=bundles/library.b9460c2b30f8433101d6.css rel=stylesheet><title>byron-kline</title><link href=css/app.8096f973.css rel=preload as=style><link href=js/app.54a1db8f.js rel=preload as=script><link href=js/chunk-vendors.d66d0e11.js rel=preload as=script><link href=css/app.8096f973.css rel=stylesheet></head><body class=\"chart-page unselectable on-widget\"><noscript><strong>We're sorry but rn-tv doesn't work properly without JavaScript enabled. Please enable it to continue.</strong></noscript><div class=loading-indicator id=loading-indicator></div><script>var JSServer = {};\n      var __initialEnabledFeaturesets = [\"charting_library\"];</script><div id=app></div><script src=js/chunk-vendors.d66d0e11.js></script><script src=js/app.54a1db8f.js></script></body></html>\n  ";
}
exports.klineChartHtml = klineChartHtml;
var KLineNativeEvents;
(function (KLineNativeEvents) {
    /**
     * 初始化
     */
    KLineNativeEvents[KLineNativeEvents["INIT"] = 0] = "INIT";
    /**
     * 历史数据处理
     */
    KLineNativeEvents[KLineNativeEvents["HISTORY"] = 1] = "HISTORY";
    /**
     * 订阅处理
     */
    KLineNativeEvents[KLineNativeEvents["SUBSCRIBE"] = 2] = "SUBSCRIBE";
    /**
     * 类型处理
     */
    KLineNativeEvents[KLineNativeEvents["TYPE"] = 3] = "TYPE";
    /**
     * 指标处理
     */
    KLineNativeEvents[KLineNativeEvents["STUDY"] = 4] = "STUDY";
    /**
     * 周期处理
     */
    KLineNativeEvents[KLineNativeEvents["INTERVAL"] = 5] = "INTERVAL";
    /**
     * 创建截图
     */
    KLineNativeEvents[KLineNativeEvents["CREATE_SHOT"] = 6] = "CREATE_SHOT";
    /**
     * 移除截图
     */
    KLineNativeEvents[KLineNativeEvents["REMOVE_SHOT"] = 7] = "REMOVE_SHOT";
    /**
     * DEFAULT
     */
    KLineNativeEvents[KLineNativeEvents["DEFAULT"] = 8] = "DEFAULT";
})(KLineNativeEvents = exports.KLineNativeEvents || (exports.KLineNativeEvents = {}));
var KLineHtmlEvents;
(function (KLineHtmlEvents) {
    /**
     * 初始化完成
     */
    KLineHtmlEvents[KLineHtmlEvents["INIT_DONE"] = 0] = "INIT_DONE";
    /**
     * 获取历史数据
     */
    KLineHtmlEvents[KLineHtmlEvents["FETCH_HISTORY"] = 1] = "FETCH_HISTORY";
    /**
     * 历史数据处理完成
     */
    KLineHtmlEvents[KLineHtmlEvents["HISTORY_DONE"] = 2] = "HISTORY_DONE";
    /**
     * 订阅数据处理完成
     */
    KLineHtmlEvents[KLineHtmlEvents["SUBSCRIBE_DONE"] = 3] = "SUBSCRIBE_DONE";
    /**
     * 类型处理完成
     */
    KLineHtmlEvents[KLineHtmlEvents["TYPE_DONE"] = 4] = "TYPE_DONE";
    /**
     * 指标处理完成
     */
    KLineHtmlEvents[KLineHtmlEvents["STUDY_DONE"] = 5] = "STUDY_DONE";
    /**
     * 周期处理完成
     */
    KLineHtmlEvents[KLineHtmlEvents["INTERVAL_DONE"] = 6] = "INTERVAL_DONE";
    /**
     * 周期切换
     */
    KLineHtmlEvents[KLineHtmlEvents["INTERVAL_SWITCH"] = 7] = "INTERVAL_SWITCH";
    /**
     * 创建截图完成
     */
    KLineHtmlEvents[KLineHtmlEvents["CREATE_SHOT_DONE"] = 8] = "CREATE_SHOT_DONE";
    /**
     * 移除截图完成
     */
    KLineHtmlEvents[KLineHtmlEvents["REMOVE_SHOT_DONE"] = 9] = "REMOVE_SHOT_DONE";
})(KLineHtmlEvents = exports.KLineHtmlEvents || (exports.KLineHtmlEvents = {}));
