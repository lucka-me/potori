const i18n = {
    language: {
        "en":       { contents: [], name: "English" },
        "zh-Hans":  { contents: [], name: "简体中文" },
    },
    menu: null,
    buttonLabel: document.getElementById("label-button-appBar-language"),
    init: () => {
        const menuElement = document.querySelector("#menu-language");
        const menuList = menuElement.querySelector("ul");
        for (const key of Object.keys(i18n.language)) {
            i18n.language[key].contents = document.querySelectorAll(`:lang(${key})`);
            const menuItem = document.createElement("ul");
            menuItem.className = "mdc-list-item";
            menuItem.setAttribute("role", "menuitem");
            menuItem.dataset.code = key;
            const menuLabel = document.createElement("span");
            menuLabel.className = "mdc-list-item__text";
            menuLabel.innerHTML = i18n.language[key].name;
            menuItem.appendChild(menuLabel);
            menuList.appendChild(menuItem);
        }
        i18n.menu = new mdc.menu.MDCMenu(menuElement);
        i18n.menu.listen("MDCMenu:selected", i18n.onSelected);
        const menuButton = new mdc.ripple.MDCRipple(document.querySelector("#button-appBar-language"));
        menuButton.listen("click", i18n.openMenu );
    },
    openMenu: () => {
        if (!i18n.menu.open) i18n.menu.open = true;
    },
    onSelected: (event) => {
        const code = event.detail.item.dataset.code;
        i18n.buttonLabel.innerHTML = i18n.language[code].name;
        for (const key of Object.keys(i18n.language)) {
            const hidden = !(key === code);
            for (const content of i18n.language[key].contents) content.hidden = hidden;
        }
    },
}