// JS for syncing form inputs to local storage

// defines the HTML IDs of every input that should be saved here.
// Code is set up to handle anything with `value` and bootstrap checkboxes right now
// opt forms require use to select `save-switch`
const optForms = ['doh-url', 'cors-switch', 'doh-method', 'doh-qtype', 'dnssec-switch'];

// we have to save references to listeners here so they can be removed later
const optListenerDict = {};
const saveSwitch = document.getElementById('save-switch');
// theme switch state is always saved
const themeSwitch = document.getElementById('theme-switch');

document.addEventListener('DOMContentLoaded', function(e) {
    saveSwitch.addEventListener("change", handleSaveSwitch);
    // try loading everything. If anything loads, set the save switch
    optForms.forEach((id) => {
        const elem = document.getElementById(id);
        const val = localStorage.getItem(id);
        if (val !== null ) {
            elem.type === "checkbox" ? elem.checked = val : elem.value = val;
            saveSwitch.checked = true;
        }
    });
    // if save switch is set now, set up listeners
    if (saveSwitch.checked)
        handleSaveSwitch();

    themeSwitch.checked = localStorage.getItem(themeSwitch.id);
    setTheme();
    themeSwitch.addEventListener('change', setTheme);
});

// handle toggling of save switch
const handleSaveSwitch = () => {
    console.log('change event: ' + saveSwitch.checked);
    // either save or clear storage
    if (saveSwitch.checked) {
        optForms.forEach((id) => {
            const elem = document.getElementById(id);
            setStoreOne(elem, id);
        });
    }
    else {
        // clear storage then restore theme switch
        localStorage.clear();
        setStoreOne(themeSwitch, themeSwitch.id)
    }

    // for each form add/remove its listener
    optForms.forEach((id) => {
        const elem = document.getElementById(id);
        if (saveSwitch.checked) {
            optListenerDict[id] = () => setStoreOne(elem, id);
            elem.addEventListener(getListenerType(elem), optListenerDict[id]);
        }
        else {
            elem.removeEventListener(getListenerType(elem), optListenerDict[id]);
            delete optListenerDict[id];
        }
    });
};


// get the event we should listen for on this given element
const getListenerType = (elem) => elem.type === "checkbox" ? 'change' : 'input';

// sets the local storage for the given element
const setStoreOne = (element, storeKey) => {
    let val;
    if (element.type === "checkbox" && !element.checked) {
        val = "";
    } else if (element.type === "checkbox") {
        val = element.checked;
    } else {
        val = element.value;
    }
    localStorage.setItem(storeKey, val);
};

// saves theme to storage and set's doc attr
const setTheme = () => {
    setStoreOne(themeSwitch, themeSwitch.id)
    themeSwitch.checked ? document.body.setAttribute("data-theme", "dark")
        : document.body.removeAttribute("data-theme");
}


