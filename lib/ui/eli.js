class Eli {
    static build(tag, options) {
        const element = document.createElement(tag);
        for (const key of Object.keys(options)) {
            switch (key) {
                case 'styleText':
                    element.style.cssText = options[key];
                    break;
                case 'children':
                    for (const child of options[key]) {
                        element.appendChild(child);
                    }
                    break;
                case 'dataset':
                    for (const data of Object.keys(options[key])) {
                        element.dataset[data] = options[key][data];
                    }
                    break;
                default:
                    element[key] = options[key];
                    break;
            }
        }
        return element;
    }

    static chartCard(title, canvas, flex, minWidth) {
        return Eli.build('div', {
            className: `mdc-card mdc-card--outlined padding--8 flex--${flex} flex-shrink--1`,
            styleText: `min-width:${minWidth}px`,
            children: [
                Eli.build('span', {
                    className: 'mdc-typography--headline6',
                    innerHTML: title,
                }),
                Eli.build('div', {
                    className: 'container-chart',
                    children: [ canvas ],
                }),
            ],
        });
    }

    static link(href, title, text) {
        return Eli.build('a', {
            href: href,
            title: title,
            target: '_blank',
            rel: 'noopener',
            innerHTML: text,
        });
    }

    static text(text) {
        return document.createTextNode(text);
    }

    static icon(icon) {
        return Eli.build('i', {
            className: 'material-icons',
            innerHTML: icon,
        });
    }

    static dialog(contents) {
        return Eli.build('div', {
            className: 'mdc-dialog mdc-dialog--scrollable',
            role: 'dialog',
            ariaModal: true,
            children: [
                Eli.build('div', {
                    className: 'mdc-dialog__container',
                    children: [
                        Eli.build('div', {
                            className: 'mdc-dialog__surface',
                            children: contents,
                        }),
                    ],
                }),
                Eli.build('div', { className: 'mdc-dialog__scrim' }),
            ],
        });
    }

    static dialogAction(action, text) {
        return Eli.build('button', {
            className: 'mdc-button mdc-dialog__button',
            dataset: { mdcDialogAction: action, },
            children: [
                Eli.build('span', {
                    className: 'mdc-button__label', innerHTML: text
                }),
            ],
        });
    }

    static notchedOutline(labelOptions) {
        labelOptions.className = 'mdc-floating-label';
        return Eli.build('div', {
            className: 'mdc-notched-outline',
            children: [
                Eli.build('div', { className: 'mdc-notched-outline__leading' }),
                Eli.build('div', {
                    className: 'mdc-notched-outline__notch',
                    children: [ Eli.build('label', labelOptions), ],
                }),
                Eli.build('div', { className: 'mdc-notched-outline__trailing' }),
            ],
        });
    }
};

export default Eli;