const dohscript = require('./doh-script-helpers');

/**
 * Custom element <doh-script> that allows you to bypass the user's system DNS resolver
 */
class DohScript extends HTMLElement {
  constructor() {
    super();
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
      dohscript.dnsLookupScriptDomain(scriptSrc, dohUrl, method)
        .then(ip => {
          return dohscript.getScript(scriptSrc, ip)
        })
        .then(code => {
          return dohscript.addScriptToDOM(code)
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
  async function loadInSequence(dohScripts) {
    const errors = [];
    for (let script of dohScripts) {
      try {
        await script.load();
      } catch (e) {
        errors.push(e);
      }
    }
    if (errors.length > 0) {
      throw errors;
    }
  }
  let dohScripts = document.getElementsByTagName('doh-script');
  dohScripts = Array.prototype.slice.call(dohScripts);
  try {
    await loadInSequence(dohScripts);
    const event = new CustomEvent('doh-scripts-loaded');
    document.dispatchEvent(event);
  } catch (e) {
    throw e;
  }
});
