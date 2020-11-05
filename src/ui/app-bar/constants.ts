/**
 * Actions in app bar
 */
export const AppBarActions = {
    view:   { key: 'view'   , title: 'ui.app-bar.list'      , icon: '\uf00b' },
    signin: { key: 'signin' , title: 'ui.app-bar.signIn'    , icon: '\uf2bd' },
    open:   { key: 'open'   , title: 'ui.app-bar.open'      , icon: '\uf07c' },
    about:  { key: 'about'  , title: 'ui.app-bar.about'     , icon: '\uf05a' },
    menu:   { key: 'menu'   , title: 'ui.app-bar.menu'      , icon: '\uf142' },
};

export const ClassName = {
    appBar: 'mdc-top-app-bar mdc-top-app-bar--fixed',
    sectionTitle: [
        'mdc-top-app-bar__section',
        'mdc-top-app-bar__section--align-start'
    ].join(' '),
    sectionActions: [
        'mdc-top-app-bar__section',
        'mdc-top-app-bar__section--align-end'
    ].join(' '),
    action: 'fa mdc-icon-button',
};

export const StringKey = {
    dashboard: 'ui.app-bar.dashboard',
    list: 'ui.app-bar.list',
}