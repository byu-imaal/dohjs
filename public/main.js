const doh = require('../lib/doh');

document.addEventListener('DOMContentLoaded', function(e) {
    document.getElementById('do-doh').addEventListener('click', function(e) {
        const responseElem = document.getElementById('doh-response');
        responseElem.childNodes.forEach(node => node.remove());
        const url = document.getElementById('doh-url').value;
        if (!url) {
           alert('you gotta do a url');
           return;
        }
        const method = document.getElementById('doh-method').value;
        const qname = document.getElementById('doh-qname').value;
        const qtype = document.getElementById('doh-qtype').value;
        let options = {
            url: url,
            method: method,
            qname: qname,
            qtype: qtype,
            success: response => {
                responseElem.innerHTML = `<pre>${JSON.stringify(response, null, 4)}</pre>`;
            },
            error: err => {
                console.error(err);
                responseElem.innerHTML = `
<div class="text-danger">
    An error occurred with your DNS request. 
    Could be a CORS issue (hint: check the console for more details). 
    Here is the error: 
  <p class="font-weight-bold">${err}</p>
</div>`;
            }
        };
        doh(options);
    })
});
