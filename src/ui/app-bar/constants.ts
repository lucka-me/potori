import { eliIcon } from 'eli/icon';

const StringKeyBase = 'ui.app-bar';

/**
 * Actions in app bar
 */
export const AppBarActions = {
    view:   { key: 'view'   , title: `${StringKeyBase}.list`    , icon: eliIcon.Icon.thList     },
    signin: { key: 'signin' , title: `${StringKeyBase}.signIn`  , icon: eliIcon.Icon.userCircle },
    open:   { key: 'open'   , title: `${StringKeyBase}.open`    , icon: eliIcon.Icon.folderOpen },
    about:  { key: 'about'  , title: `${StringKeyBase}.about`   , icon: eliIcon.Icon.infoCircle },
    menu:   { key: 'menu'   , title: `${StringKeyBase}.menu`    , icon: eliIcon.Icon.ellipsisV  },
};

export const StringKey = {
    dashboard: `${StringKeyBase}.dashboard`,
    list: `${StringKeyBase}.list`,
}