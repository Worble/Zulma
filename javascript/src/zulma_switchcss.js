(function (switch_css) {
  //Constants
  const THEME_KEY = "ZULMA_THEME";
  const THEME = localStorage.getItem(THEME_KEY);
  const STOP_BLINK_CSS_ID = "stop-blink";
  const STYLESHEET_CLASSNAME = "stylesheet";

  //Variables
  let previousLink = null;
  let baseUrl = "";

  //Events
  /* The function called when the css has finished loading */
  const onLinkLoad = event => {
    //remove event listeners
    let link = event.currentTarget;
    link.removeEventListener("load", onLinkLoad);
    link.removeEventListener("error", onLinkError);
    //remove the previous stylesheet(s)
    removeStylesheets();
    //add stylesheet class
    link.className += STYLESHEET_CLASSNAME;
    //everything is good, so we don't need this
    previousLink = null;
    //make body visible again if it was hidden
    showBody();
  };

  const onLinkError = event => {
    //remove event listeners
    let link = event.currentTarget;
    link.removeEventListener("load", onLinkLoad);
    link.removeEventListener("error", onLinkError);
    //remove theme from localstorage
    clearTheme();
    //remove theme from dropdown list
    updateThemeSelect(link.id, false);
    //remove link from page
    link.remove();
    //re-add the previous stylesheet (if any)
    if (previousLink) {
      document.getElementsByTagName("head")[0].appendChild(previousLink);
    }
    //set the theme select to the previous stylesheet
    updateThemeSelect(
      document.querySelectorAll(`.${STYLESHEET_CLASSNAME}`)[0].id,
      true
    );
    //make body visible again if it was hidden
    showBody();
  };

  //Private Methods
  /* Called when the theme is changed */
  function changeTheme(themeName, firstLoad) {
    //create the css link element
    var fileref = document.createElement("link");
    fileref.rel = "stylesheet";
    fileref.type = "text/css";
    fileref.href = `${baseUrl}${baseUrl.slice(-1) !== "/" ? "/" : ""}${themeName}.css`;
    fileref.id = themeName;

    //append it to the head
    let link = document.getElementsByTagName("head")[0].appendChild(fileref);

    //when it's loaded, call onLinkLoad
    link.addEventListener("load", onLinkLoad);
    //if it errors, call onLinkError
    link.addEventListener("error", onLinkError);

    //if this is the first load of the page, remove the current stylesheet early to avoid flash of wrongly styled content
    if (firstLoad) {
      //keep the old link in case something goes wrong
      previousLink = document.querySelectorAll(`.${STYLESHEET_CLASSNAME}`)[0];
      removeStylesheets();
    }

    saveTheme(themeName);
  }

  /* Removes all current stylesheets on the page */
  function removeStylesheets() {
    document.querySelectorAll(`.${STYLESHEET_CLASSNAME}`).forEach(el => {
      el.remove();
    });
  }

  /* Saves the current theme in localstorage */
  function saveTheme(themeName) {
    localStorage.setItem(THEME_KEY, themeName);
  }

  /* Clears the current theme in localstorage */
  function clearTheme() {
    localStorage.removeItem(THEME_KEY);
  }

  /* Hides the body of the page */
  function hideBody() {
    let head = document.getElementsByTagName("head")[0];
    let style = document.createElement("style");
    let css = "body{visibility:hidden;}";

    style.id = STOP_BLINK_CSS_ID;
    style.setAttribute("type", "text/css");

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
  }

  /* Shows the body of the page */
  function showBody() {
    let css = document.getElementById(STOP_BLINK_CSS_ID);
    if (css) css.remove();
  }

  /* Either sets the theme selection to the given theme, or removes it from the list */
  function updateThemeSelect(theme, setSelected) {
    //get all select options
    let elements = document.querySelectorAll("#theme-select>option");
    //if there are elements, the page is loaded and continue
    if (elements.length) {
      elements.forEach(element => {
        if (element.value === theme) {
          if (setSelected) {
            element.selected = "selected";
          } else {
            element.remove();
          }
        }
      });
    } else {
      //if there are no elements, the page is not yet loaded; wait for loaded event and try again.
      window.addEventListener("DOMContentLoaded", () => {
        updateThemeSelect(theme, setSelected);
      });
    }
  }

  //Public Methods
  switch_css.init = function (url) {
    baseUrl = url
    //if user has selected and theme and it is not the current theme
    if (THEME && !document.getElementById(THEME)) {
      //hide the body to stop FOUC
      hideBody();
      //change the theme
      changeTheme(THEME, true);
      //when the DOM is loaded, change the select to their current choice
      updateThemeSelect(THEME, true);
    }
    //when the DOM is loaded, set the dropdown to trigger the theme change
    window.addEventListener("DOMContentLoaded", () => {
      document.getElementById("theme-select").onchange = function () {
        changeTheme(this.value);
      };
    });
  };
})((switch_css = window.switch_css || {})); // eslint-disable-line