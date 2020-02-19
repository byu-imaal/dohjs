const cors_proxy = "https://cors.dohjs.workers.dev";

document.addEventListener('DOMContentLoaded', function(e) {
    const responseElem = document.getElementById('doh-response');
    const $loadingModal = $('#loading-modal');
    const doDohBtn = document.getElementById('do-doh');
    const corsifyBtn = document.getElementById("corsify");
    const urlInputElem = document.getElementById('doh-url');
    const urlDropdown = document.getElementById('url-dropdown');

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

        const url = urlInputElem.value;
        if (!url) {
            return;
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

    // just toggles button state
    const toggleCORSButton = function() {
        if (urlInputElem.value.includes(cors_proxy)) {
            corsifyBtn.classList.remove("btn-outline-primary");
            corsifyBtn.classList.add('btn-primary');
            corsifyBtn.innerText = "Remove CORS Proxy";
        }
        else {
            corsifyBtn.classList.remove('btn-primary');
            corsifyBtn.classList.add("btn-outline-primary");
            corsifyBtn.innerText = "Use CORS Proxy";
        }
    };

    doDohBtn.addEventListener('click', doDoh);
    urlInputElem.addEventListener('input', toggleCORSButton); // user may remove proxy in form

    document.body.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            doDoh();
        }
    });

    corsifyBtn.addEventListener('click', function(e) {
        if (!urlInputElem.value.includes(cors_proxy)) {
            urlInputElem.value = cors_proxy + urlInputElem.value;
        }
        else {
            urlInputElem.value = urlInputElem.value.substr(cors_proxy.length);
        }
        toggleCORSButton();
    });

    urlDropdown.addEventListener('click', function (e) {
        console.log(e.target);
        if ("dohurl" in e.target.dataset) {
            urlInputElem.value = e.target.dataset.dohurl;
        }
    });
});
