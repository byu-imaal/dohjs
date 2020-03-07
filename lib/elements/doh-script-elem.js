const dohElemUtils = require('./doh-elem-utils');

/**
 * Custom element <doh-script> that allows you to bypass the user's system DNS resolver
 */
class DohScript extends HTMLElement {
  constructor() {
    super();
    this.headers = {
      'Accept': 'application/javascript'
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
      const scriptSrc = this.getAttribute('src');
      dohElemUtils.dnsLookupResource(scriptSrc, dohUrl, method)
        .then(ip => {
          return dohElemUtils.getResource(scriptSrc, ip, this.headers)
        })
        .then(code => {
          return dohElemUtils.addScriptToDOM(code)
        })
        .then(resolve)
        .catch(reject);
    }));
  }

  disconnectedCallback() {}

  adoptedCallback() {}
}

customElements.define('doh-script', DohScript);

/**
 * Load <doh-script> tags in order
 * Fire custom event ('doh-scripts-loaded') when all the <doh-script>s have been loaded
 */
document.addEventListener('DOMContentLoaded', async function(e) {

  let dohScripts = document.getElementsByTagName('doh-script');
  dohScripts = Array.prototype.slice.call(dohScripts);
  if (dohScripts.length === 0) {
    /* just return, don't dispatch the 'doh-scripts-loaded' event because no scripts were loaded */
    return;
  }
  try {
    await dohElemUtils.loadInSequence(dohScripts);
    const event = new CustomEvent('doh-scripts-loaded');
    document.dispatchEvent(event);
  } catch (e) {
    throw e;
  }
});
