const cors_proxy = "https://cors.dohjs.workers.dev/";

document.addEventListener('DOMContentLoaded', function(e) {
    // CONSTANTS
    const responseElem = document.getElementById('doh-response');
    const $loadingModal = $('#loading-modal');
    const doDohBtn = document.getElementById('do-doh');
    const urlInputElem = document.getElementById('doh-url');
    const urlDropdown = document.getElementById('url-dropdown');
    const corsSwitch = document.getElementById('cors-switch');
    const dnssecSwitch = document.getElementById("dnssec-switch");
    const copyRespBtn = document.getElementById('copy-resp');

    // SET UP
    // enable popovers
    $('[data-toggle="popover"]').popover();
    // ignore clicks on popovers to make clicking links easier
    $('body').on('mousedown', '.popover', function(e) {
        e.preventDefault()
    });

    // FUNCTIONS
    const errorFunction = (err) => {
        console.error(err);
        $loadingModal.modal('hide');
        doDohBtn.disabled = false;
        copyRespBtn.disabled = true;
        responseElem.innerHTML = `
<div class="text-danger">
    An error occurred with your DNS request
    (check the console for more details).
    Here is the error:
  <p class="font-weight-bold">${err}</p>
</div>`;
    };

    const successFunction = (response) => {
        responseElem.innerHTML = `<pre>${JSON.stringify(doh.prettify(response), null, 4)}</pre>`;
        $loadingModal.modal('hide');
        doDohBtn.disabled = false;
        copyRespBtn.disabled = false;
    };

    const doDoh = function() {
        responseElem.childNodes.forEach(node => node.remove());
        $loadingModal.modal('show');
        document.getElementById('do-doh').disabled = true;

        let url = urlInputElem.value || "https://cloudflare-dns.com/dns-query";
        if (corsSwitch.checked) {
            url = cors_proxy + url;
        }
        const method = document.getElementById('doh-method').value || 'POST';
        const qname = document.getElementById('doh-qname').value || '.';
        const qtype = document.getElementById('doh-qtype').value || 'A';

        const query = doh.makeQuery(qname, qtype);
        if (dnssecSwitch.checked) {
            query.additionals =  [{
                type: 'OPT',
                name: '.',
                udpPayloadSize: 4096,
                flags: doh.dnsPacket.DNSSEC_OK,
                options: []
            }]
        }
        console.log(JSON.stringify(query));
        console.log();
        console.log(query.flags & doh.dnsPacket.AUTHENTIC_DATA);

        doh.sendDohMsg(query, url, method)
            .then(successFunction)
            .catch(errorFunction);
    };

    // handle clicking of 'send' button and enter key
    doDohBtn.addEventListener('click', doDoh);
    document.body.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            doDoh();
        }
    });

    // set resolver url to selection from dropdown
    urlDropdown.addEventListener('click', function (e) {
        if ("dohurl" in e.target.dataset) {
            urlInputElem.value = e.target.dataset.dohurl;
        }
    });

    copyRespBtn.addEventListener('click', function (e) {
        const selectRange = document.createRange();
        const elem = responseElem.getElementsByTagName('pre')[0];
        if (elem) {
            selectRange.selectNode(elem);
            console.log('copy' + selectRange);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(selectRange);
            document.execCommand("copy");
            window.getSelection().removeAllRanges();
        }
        else {
            console.log('No element to copy');
        }

    });
});
