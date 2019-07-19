export function sendMessageHtml(name, params = {}) {
  return `
  window.sendMessageHtml(${JSON.stringify({
    event: name,
    data: params
  })})
  `
}
