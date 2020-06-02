const eliKit = {
    build(tag, options) {
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
    },
    chartCard(title, canvas, flex, minWidth) {
        return eliKit.build('div', {
            className: `mdc-card mdc-card--outlined padding--8 flex--${flex} flex-shrink--1`,
            styleText: `min-width:${minWidth}px`,
            children: [
                eliKit.build('span', {
                    className: 'mdc-typography--headline6',
                    innerHTML: title,
                }),
                eliKit.build('div', {
                    className: 'container-chart',
                    children: [ canvas ],
                }),
            ],
        });
    },
    link(href, title, text) {
        return eliKit.build('a', {
            href: href,
            title: title,
            target: '_blank',
            rel: 'noopener',
            innerHTML: text,
        });
    },
    text(text) {
        return document.createTextNode(text);
    },
    dialog(contents) {
        return eliKit.build('div', {
            className: 'mdc-dialog mdc-dialog--scrollable',
            role: 'dialog',
            ariaModal: true,
            children: [
                eliKit.build('div', {
                    className: 'mdc-dialog__container',
                    children: [
                        eliKit.build('div', {
                            className: 'mdc-dialog__surface',
                            children: contents,
                        }),
                    ],
                }),
                eliKit.build('div', { className: 'mdc-dialog__scrim' }),
            ],
        });
    },
};