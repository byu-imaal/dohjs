// document must have this element
const themeSwitch = document.getElementById('theme-switch');

document.addEventListener('DOMContentLoaded', function(e) {
    themeSwitch.checked = localStorage.getItem(themeSwitch.id);
    setTheme();
    themeSwitch.addEventListener('change', setTheme);
});


// saves theme to storage and set's body attr
const setTheme = () => {
    localStorage.setItem(themeSwitch.id, themeSwitch.checked ? true : "")
    themeSwitch.checked ? document.body.setAttribute("data-theme", "dark")
        : document.body.removeAttribute("data-theme");
}

