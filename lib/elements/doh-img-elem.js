const dohElemUtils = require('./doh-elem-utils');

/**
 * Custom element <doh-script> that allows you to bypass the user's system DNS resolver
 */
class DohImg extends HTMLElement {
  constructor() {
    super();
    this.headers = {
      'Accept': 'image/*'
    };
  }

  async connectedCallback() {
    try {
      await this.load();
    } catch (e) {
      console.error(e);
    }
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
        .then(imgBytes => {
          return this.addImageToDOM(imgBytes)
        })
        .then(resolve)
        .catch(reject);
    }));
  }

  addImageToDOM(imgBytes) {
    const img = document.createElement('img');
    img.src = "data:image/png;base64," + imgBytes.toString('base64');
    this.appendChild(img);
  }

  disconnectedCallback() {}

  adoptedCallback() {}
}

customElements.define('doh-img', DohImg);
