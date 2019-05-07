(function (switch_css) {
    //Constants
    const THEME_KEY = "ZULMA_THEME";
    const STOP_LINK_CSS_ID = "stop-blink";
    const STYLESHEET_CLASSNAME = "stylesheet"

    //Variables
    let link = null;
    let theme = localStorage.getItem(THEME_KEY);

    //Private Methods
    /* Called when the theme is changed */
    function changeTheme(themeName, firstLoad) {
        //create the css link element
        var fileref = document.createElement("link");
        fileref.rel = "stylesheet";
        fileref.type = "text/css";
        fileref.href = `/${themeName}.css`;

        //append it to the head
        link = document.getElementsByTagName("head")[0].appendChild(fileref);

        //when it's loaded, call onLinkLoad
        link.addEventListener('load', onLinkLoad);

        //if this is the first load of the page, remove the current stylesheet early to avoid flash of wrongly styled content
        if (firstLoad) {
            removeStylesheets();
        }

        saveTheme(themeName);
    };

    function removeStylesheets() {
        document.querySelectorAll(`.${STYLESHEET_CLASSNAME}`).forEach((el) => {
            el.remove();
        });
    }

    /* The function called when the css has finished loading */
    function onLinkLoad() {
        link.removeEventListener('load', onLinkLoad);
        //remove the previous stylesheet(s)
        removeStylesheets();
        //add stylesheet class
        link.className += STYLESHEET_CLASSNAME;
        //make body visible again if it was hidden
        showBody();
    };

    /* Saves the current theme in localstorage */
    function saveTheme(themeName) {
        localStorage.setItem(THEME_KEY, themeName);
    };

    /* Hides the body of the page */
    function hideBody() {
        var head = document.getElementsByTagName('head')[0];
        var style = document.createElement('style');

        style.id = STOP_LINK_CSS_ID;
        style.setAttribute('type', 'text/css');

        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode('body{visibility:hidden;}'));
        }
        head.appendChild(style);
    };

    /* Shows the body of the page */
    function showBody() {
        let css = document.getElementById(STOP_LINK_CSS_ID);
        if (css)
            css.remove();
    };

    //Public Methods
    switch_css.init = function () {
        //if user has selected and theme and it is not the current theme
        if (theme && !document.getElementById(theme)) {
            //hide the body to stop FOUC
            hideBody();
            //change the theme
            changeTheme(theme, true);
            //when the DOM is loaded, change the select to their current choice
            window.addEventListener('DOMContentLoaded', () => {
                document.querySelectorAll('#theme-select>option').forEach(element => {
                    if (element.value === theme) {
                        element.selected = 'selected';
                    }
                });
            });
        }
        //when the DOM is loaded, set the dropdown to trigger the theme change
        window.addEventListener('DOMContentLoaded', () => {
            document.getElementById('theme-select').onchange = function () {
                changeTheme(this.value);
            }
        });
    }
}(switch_css = window.switch_css || {}));

switch_css.init();