"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sendMessageHtml(name, params) {
    return "\n  window.sendMessageHtml(" + JSON.stringify({
        event: name,
        data: params
    }) + ")\n  ";
}
exports.sendMessageHtml = sendMessageHtml;
