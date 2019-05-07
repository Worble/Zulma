(function (switch_css) {
    //Constants
    const THEME_KEY = "ZULMA_THEME";
    const STOP_LINK_CSS_ID = "stop-blink";

    //Variables
    let link = null;
    let theme = localStorage.getItem(THEME_KEY);

    //Private Methods
    function changeTheme(themeName, firstLoad) {
        var fileref = document.createElement("link");
        fileref.rel = "stylesheet";
        fileref.type = "text/css";
        fileref.href = `/${themeName}.css`;
        link = document.getElementsByTagName("head")[0].appendChild(fileref);

        link.addEventListener('load', onLinkLoad);
        if (firstLoad) {
            document.querySelectorAll('.stylesheet').forEach((el) => {
                el.remove();
            });
        }

        saveTheme(themeName);
    };

    function onLinkLoad() {
        link.removeEventListener('load', onLinkLoad);
        document.querySelectorAll('.stylesheet').forEach((el) => {
            el.remove();
        });
        link.className += 'stylesheet';
        addcss('body{visibility:visible;}');
    };

    function saveTheme(themeName) {
        localStorage.setItem(THEME_KEY, themeName);
    };

    function addcss(css) {
        let el = document.getElementById(STOP_LINK_CSS_ID);
        if (el) {
            el.innerText = css;
        } else {
            var head = document.getElementsByTagName('head')[0];
            var style = document.createElement('style');
            style.id = STOP_LINK_CSS_ID;
            style.setAttribute('type', 'text/css');
            if (style.styleSheet) { // IE
                style.styleSheet.cssText = css;
            } else { // the world
                style.appendChild(document.createTextNode(css));
            }
            head.insertBefore(style, head.firstChild);
        }
    };

    //Public Methods
    switch_css.init = function () {
        if (theme && !document.getElementById(theme)) {
            addcss('body{visibility:hidden;}')
            changeTheme(theme, true);
            window.addEventListener('DOMContentLoaded', () => {
                document.querySelectorAll('#theme-select>option').forEach(element => {
                    if (element.value === theme) {
                        element.selected = 'selected';
                    }
                });
            });
        }
        window.addEventListener('DOMContentLoaded', () => {
            document.getElementById('theme-select').onchange = function () {
                changeTheme(this.value);
            }
        });
    }
}(switch_css = window.switch_css || {}));

switch_css.init();