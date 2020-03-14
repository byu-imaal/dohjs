const dohElemUtils = require('./doh-elem-utils');

class DohStyle extends HTMLElement {
  constructor() {
    super();
    this.headers = {
      'Accept': 'text/css'
    };
  }

  connectedCallback() {

  }

  load() {
    return new Promise(((resolve, reject) => {
      if (!this.getAttribute('resolver')) {
        return reject('missing required attribute "resolver"');
      }
      if (!this.getAttribute('src')) {
        return reject('missing required attribute "src"');
      }
      const method = this.getAttribute('method') || 'POST';
      const dohUrl = this.getAttribute('resolver');
      const stylesheetSrc = this.getAttribute('src');
      dohElemUtils.dnsLookupResource(stylesheetSrc, dohUrl, method)
        .then(ip => {
          return dohElemUtils.getResource(stylesheetSrc, ip)
        })
        .then(css => {
          return this.addStylesheetToDOM(css)
        })
        .then(resolve)
        .catch(reject);
    }));
  }

  addStylesheetToDOM = function(css) {
    return new Promise(((resolve, reject) => {
      var stylesheet = document.createElement('style');
      var cssText = document.createTextNode(css);
      stylesheet.appendChild(cssText);
      document.head.appendChild(stylesheet);
      return resolve();
    }));
  };

  disconnectedCallback() {}

  adoptedCallback() {}
}

customElements.define('doh-style', DohStyle);

/**
 * Load <doh-style> tags in order
 * Fire custom event ('doh-styles-loaded') when all the <doh-style>s have been loaded
 */
document.addEventListener('DOMContentLoaded', async function(e) {
  let dohStyles = document.getElementsByTagName('doh-style');
  dohStyles = Array.prototype.slice.call(dohStyles);
  if (dohStyles.length === 0) {
    /* just return, don't dispatch the 'doh-styles-loaded' event because no scripts were loaded */
    return;
  }
  try {
    await dohElemUtils.loadInSequence(dohStyles);
    const event = new CustomEvent('doh-styles-loaded');
    document.dispatchEvent(event);
  } catch (e) {
    throw e;
  }
});
