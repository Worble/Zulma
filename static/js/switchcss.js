const THEME_KEY = "ZULMA_THEME";

function changeTheme(themeName) {
    let alternates = [];

    document.querySelectorAll('link.stylesheet').forEach(element => {
        if (element.id === themeName) {
            element.media = '';
        }
        else {
            alternates.push(element);
        }
    });

    alternates.forEach(element => {
        element.media = 'none';
    });

    saveTheme(themeName);
}

function saveTheme(themeName) {
    localStorage.setItem(THEME_KEY, themeName);
}

window.addEventListener('DOMContentLoaded', () => {
    let theme = localStorage.getItem(THEME_KEY);
    if (theme) {
        changeTheme(theme);
        document.querySelectorAll('#theme-select>option').forEach(element => {
            if (element.value === theme) {
                element.selected = 'selected';
            }
        });
    }
});

window.addEventListener('load', () => {
    document.getElementById('theme-select').onchange = function () {
        changeTheme(this.value);
    }
});