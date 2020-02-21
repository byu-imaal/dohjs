const cors_proxy = "https://cors.dohjs.workers.dev/";

document.addEventListener('DOMContentLoaded', function(e) {
    // CONSTANTS
    const responseElem = document.getElementById('doh-response');
    const $loadingModal = $('#loading-modal');
    const doDohBtn = document.getElementById('do-doh');
    const urlInputElem = document.getElementById('doh-url');
    const urlDropdown = document.getElementById('url-dropdown');
    const corsSwitch = document.getElementById('cors-switch');

    // SET UP
    // enable popovers
    $(document).ready(function($){
        $('[data-toggle="popover"]').popover();
    });
    // ignore clicks on popovers to make clicking links easier
    $('body').on('mousedown', '.popover', function(e) {
        e.preventDefault()
    });


    // FUNCTIONS
    const errorFunction = (err) => {
        console.error(err);
        $loadingModal.modal('hide');
        doDohBtn.disabled = false;
        responseElem.innerHTML = `
<div class="text-danger">
    An error occurred with your DNS request
    (check the console for more details).
    Here is the error:
  <p class="font-weight-bold">${err}</p>
</div>`;
    };

    const successFunction = (response) => {
        responseElem.innerHTML = `<pre>${JSON.stringify(response, null, 4)}</pre>`;
        $loadingModal.modal('hide');
        doDohBtn.disabled = false;
    };

    const doDoh = function() {
        const dohForm = document.getElementById('try-doh-form');
        dohForm.classList.remove('needs-validation');
        dohForm.classList.add('was-validated');

        responseElem.childNodes.forEach(node => node.remove());

        let url = urlInputElem.value;
        if (!url) {
            return;
        }
        if (corsSwitch.checked) {
            url = cors_proxy + url;
        }
        const method = document.getElementById('doh-method').value || 'POST';
        const qname = document.getElementById('doh-qname').value || '.';
        const qtype = document.getElementById('doh-qtype').value || 'A';
        $loadingModal.modal('show');
        document.getElementById('do-doh').disabled = true;
        const resolver = new doh.DohResolver(url);
        resolver.query(qname, qtype, method)
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
});
