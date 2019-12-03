(function() {
  window.urlParams = (function () {
    var match,
      pl	 = /\+/g,  // Regex for replacing addition symbol with a space
      search = /([^&=]+)=?([^&]*)/g,
      decode = function (s) { return decodeURIComponent(s.replace(pl, ' ')).replace(/<\/?[^>]+(>|$)/g, ''); },
      query = function() {
        if (window.zhuwenbo) {
          return window.zhuwenbo;
        } else {
          throw "Unexpected use of this page";
        }
      }(),
      result = {};

    while (match = search.exec(query)) {
      result[decode(match[1])] = decode(match[2]);
    }

    var additionalSettingsObject = window.parent[result.uid];

    var customObjectNames = ['datafeed', 'customFormatters', 'brokerFactory'];

    for (var p in additionalSettingsObject) {
      if (customObjectNames.indexOf(p) === -1) {
        result[p] = JSON.stringify(additionalSettingsObject[p]);
      }
    }

    return result;
  })();

  window.locale = urlParams.locale;
  window.language = urlParams.locale; // a very big attention needed here

  window.addCustomCSSFile = function(href) {
    var link = document.createElement('link');
    link.setAttribute('type', 'text/css');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', href);
    document.body.appendChild(link);
  };

  if (!!urlParams.customCSS) {
    window.addCustomCSSFile(urlParams.customCSS);
  }

  var loadingScreenParams = {};

  if (typeof urlParams.loading_screen === 'string') {
    try {
      loadingScreenParams = JSON.parse(urlParams.loading_screen);
    } catch(e) {}
  }

  var loadingIndicatorElement = document.getElementById('loading-indicator');

  if (loadingScreenParams.backgroundColor) {
    loadingIndicatorElement.style = 'background-color: ' + loadingScreenParams.backgroundColor;
  }

  !function(){"use strict";var n,e;!function(n,e){void 0===e&&(e={});var t=e.insertAt;if(n&&"undefined"!=typeof document){var i=document.head||document.getElementsByTagName("head")[0],r=document.createElement("style");r.type="text/css","top"===t&&i.firstChild?i.insertBefore(r,i.firstChild):i.appendChild(r),r.styleSheet?r.styleSheet.cssText=n:r.appendChild(document.createTextNode(n))}}("\n/* Thanks to google guys for the original <paper-spinner> =)\n * https://github.com/PolymerElements/paper-spinner */\n.tv-spinner {\n  display: none;\n  position: absolute;\n  width: 1em;\n  height: 1em;\n  top: calc(50% - 0.5em);\n  left: calc(50% - 0.5em);\n  margin: 0 auto;\n  color: #37a6ef;\n  animation: tv-spinner__container-rotate 0.9s linear infinite;\n  will-change: transform;\n  /* The spinner does not have any contents that would have to be\n\t * flipped if the direction changes. Always use ltr so that the\n\t * style works out correctly in both cases. */\n  direction: ltr;\n}\n.tv-spinner--size_mini {\n  font-size: 16px;\n}\n.tv-spinner--size_medium {\n  font-size: 32px;\n}\n.tv-spinner--size_large {\n  font-size: 56px;\n}\n.tv-spinner--size_mini .tv-spinner__width_element:after {\n  border-width: 2px;\n}\n.tv-spinner--size_medium .tv-spinner__width_element:after {\n  border-width: 3px;\n}\n.tv-spinner--size_large .tv-spinner__width_element:after {\n  border-width: 4px;\n}\n.tv-spinner--shown {\n  display: block;\n}\n.tv-spinner__spinner-layer {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  white-space: nowrap;\n  color: currentColor;\n  transform: rotate(90deg);\n  /**\n\t\t * Patch the gap that appear between the two adjacent div.circle-clipper while the\n\t\t * spinner is rotating (appears on Chrome 50, Safari 9.1.1, and Edge).\n\t\t */\n}\n.tv-spinner__spinner-layer::after {\n  content: '';\n  position: absolute;\n  box-sizing: border-box;\n  top: 0;\n  border-width: 0.07em;\n  border-radius: 50%;\n  left: 45%;\n  width: 10%;\n  border-top-style: solid;\n}\n.tv-spinner__background {\n  display: inline-block;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n}\n.tv-spinner__background::after {\n  content: '';\n  position: absolute;\n  box-sizing: border-box;\n  top: 0;\n  left: 0;\n  border-radius: 50%;\n  bottom: 0;\n  width: 100%;\n  border-color: rgba(135, 151, 165, 0.2);\n  border-style: solid;\n}\n.tv-spinner__circle-clipper {\n  display: inline-block;\n  position: relative;\n  width: 50%;\n  height: 100%;\n  overflow: hidden;\n}\n.tv-spinner__circle-clipper::after {\n  content: '';\n  position: absolute;\n  box-sizing: border-box;\n  top: 0;\n  border-radius: 50%;\n  bottom: 0;\n  width: 200%;\n  border-style: solid;\n  border-bottom-color: transparent;\n  animation-duration: 1.4s;\n  animation-timing-function: cubic-bezier(0.36, 0, 0.37, 0.99);\n  animation-iteration-count: 1;\n  will-change: transform;\n}\n.tv-spinner__circle-clipper--left::after {\n  left: 0;\n  border-right-color: transparent;\n  transform: rotate(0deg);\n  animation-name: tv-spinner__left-spin;\n}\n.tv-spinner__circle-clipper--right::after {\n  left: -100%;\n  border-left-color: transparent;\n  transform: rotate(-124deg);\n  animation-name: tv-spinner__right-spin;\n}\n@keyframes tv-spinner__container-rotate {\n  100% {\n    transform: rotate(360deg);\n  }\n}\n@keyframes tv-spinner__left-spin {\n  0% {\n    transform: rotate(130deg);\n  }\n  to {\n    transform: rotate(0deg);\n  }\n}\n@keyframes tv-spinner__right-spin {\n  0% {\n    transform: rotate(-130deg);\n  }\n  to {\n    transform: rotate(-124deg);\n  }\n}\n"),"WeakMap"in window&&(n=new WeakMap),function(n){n[n.Element=1]="Element",n[n.Document=9]="Document"}(e||(e={}));var t="large";var i,r=function(t,i){var r,o=function(t,i){var r,o;return r=null==i?document.documentElement:i.nodeType===e.Document?i.documentElement:i,n&&(o=n.get(r)),o||((o=r.ownerDocument.createRange()).selectNodeContents(r),n&&n.set(r,o)),o.createContextualFragment(t)}(t,i);if("firstElementChild"in o)r=o.firstElementChild;else{r=null;for(var s=0;s<o.childNodes.length;s++){var a=o.childNodes[s];if(a.nodeType===e.Element){r=a;break}}}return null!==r&&o.removeChild(r),r}((void 0===i&&(i=""),'\n\t\t<div class="tv-spinner" role="progressbar">\n\t\t\t<div class="tv-spinner__spinner-layer">\n\t\t\t\t<div class="tv-spinner__background tv-spinner__width_element"></div>\n\t\t\t\t<div class="tv-spinner__circle-clipper tv-spinner__width_element tv-spinner__circle-clipper--left"></div>\x3c!--\n\t\t\t\t--\x3e<div class="tv-spinner__circle-clipper tv-spinner__width_element tv-spinner__circle-clipper--right"></div>\n\t\t\t</div>\n\t\t</div>\n\t')),o=function(){function n(n){this._shown=!1,this._el=r.cloneNode(!0),this.setSize(n||t)}return n.prototype.spin=function(n){return this._el.classList.add("tv-spinner--shown"),void 0===this._container&&(this._container=n,n.appendChild(this._el)),this._shown=!0,this},n.prototype.stop=function(n){return n&&void 0!==this._container&&this._container.removeChild(this._el),this._el.classList.remove("tv-spinner--shown"),this._shown=!1,this},n.prototype.setStyle=function(n){var e=this;return Object.keys(n).forEach(function(t){var i=n[t];void 0!==i&&e._el.style.setProperty(t,i)}),this},n.prototype.setSize=function(n){var e=void 0!==n?"tv-spinner--size_"+n:"";return this._el.className="tv-spinner "+e+" "+(this._shown?"tv-spinner--shown":""),this},n.prototype.getEl=function(){return this._el},n.prototype.destroy=function(){this.stop(),delete this._el,delete this._container},n}();window.Spinner=o}();


  var spinnerColor = (loadingScreenParams.foregroundColor) ? loadingScreenParams.foregroundColor : 'auto';

  var loadingSpinner = new Spinner('large').setStyle({
    color: spinnerColor,
    zIndex: String(2e9),
  });
  loadingSpinner.getEl().classList.add('spinner');
  loadingSpinner.spin(loadingIndicatorElement);
})();