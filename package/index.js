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
    return "\n  <!DOCTYPE html><html lang=en dir=ltr><head><meta charset=utf-8><meta http-equiv=X-UA-Compatible content=\"IE=edge\"><meta name=viewport content=\"width=device-width,initial-scale=1\"><link type=text/css href=bundles/library.b9460c2b30f8433101d6.css rel=stylesheet><script src=bundles/byron_kline_tv_languages.js></script><title>byron-kline</title><link href=css/app.8096f973.css rel=preload as=style><link href=js/app.f3c2af5b.js rel=preload as=script><link href=js/chunk-vendors.d66d0e11.js rel=preload as=script><link href=css/app.8096f973.css rel=stylesheet></head><body class=\"chart-page unselectable on-widget\"><noscript><strong>We're sorry but rn-tv doesn't work properly without JavaScript enabled. Please enable it to continue.</strong></noscript><div class=loading-indicator id=loading-indicator></div><script>var JSServer = {};\n      var __initialEnabledFeaturesets = [\"charting_library\"];</script><div id=app></div><script src=js/chunk-vendors.d66d0e11.js></script><script src=js/app.f3c2af5b.js></script></body></html>\n  ";
}
exports.klineChartHtml = klineChartHtml;
var KLineNativeEvents;
(function (KLineNativeEvents) {
    /**
     * 初始化
     */
    KLineNativeEvents["INIT"] = "INIT";
    /**
     * 历史数据处理
     */
    KLineNativeEvents["HISTORY"] = "HISTORY";
    /**
     * 订阅处理
     */
    KLineNativeEvents["SUBSCRIBE"] = "SUBSCRIBE";
    /**
     * 类型处理
     */
    KLineNativeEvents["TYPE"] = "TYPE";
    /**
     * 指标处理
     */
    KLineNativeEvents["STUDY"] = "STUDY";
    /**
     * 周期处理
     */
    KLineNativeEvents["INTERVAL"] = "INTERVAL";
    /**
     * 创建截图
     */
    KLineNativeEvents["CREATE_SHOT"] = "CREATE_SHOT";
    /**
     * 移除截图
     */
    KLineNativeEvents["REMOVE_SHOT"] = "REMOVE_SHOT";
    /**
     * DEFAULT
     */
    KLineNativeEvents["DEFAULT"] = "DEFAULT";
})(KLineNativeEvents = exports.KLineNativeEvents || (exports.KLineNativeEvents = {}));
var KLineHtmlEvents;
(function (KLineHtmlEvents) {
    /**
      * 初始化完成
      */
    KLineHtmlEvents["INIT_DONE"] = "INIT_DONE";
    /**
     * 获取历史数据
     */
    KLineHtmlEvents["FETCH_HISTORY"] = "FETCH_HISTORY";
    /**
     * 历史数据处理完成
     */
    KLineHtmlEvents["HISTORY_DONE"] = "HISTORY_DONE";
    /**
     * 订阅数据处理完成
     */
    KLineHtmlEvents["SUBSCRIBE_DONE"] = "SUBSCRIBE_DONE";
    /**
     * 类型处理完成
     */
    KLineHtmlEvents["TYPE_DONE"] = "TYPE_DONE";
    /**
     * 指标处理完成
     */
    KLineHtmlEvents["STUDY_DONE"] = "STUDY_DONE";
    /**
     * 周期处理完成
     */
    KLineHtmlEvents["INTERVAL_DONE"] = "INTERVAL_DONE";
    /**
     * 周期切换
     */
    KLineHtmlEvents["INTERVAL_SWITCH"] = "INTERVAL_SWITCH";
    /**
     * 创建截图完成
     */
    KLineHtmlEvents["CREATE_SHOT_DONE"] = "CREATE_SHOT_DONE";
    /**
     * 移除截图完成
     */
    KLineHtmlEvents["REMOVE_SHOT_DONE"] = "REMOVE_SHOT_DONE";
})(KLineHtmlEvents = exports.KLineHtmlEvents || (exports.KLineHtmlEvents = {}));
