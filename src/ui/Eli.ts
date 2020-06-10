class Eli {
    static build(tag: string, options: any): HTMLElement {
        const element = document.createElement(tag);
        for (const [key, value] of Object.entries(options)) {
            switch (key) {
                case 'styleText':
                    element.style.cssText = value as string;
                    break;
                case 'children':
                    element.append(...value as Array<HTMLElement>);
                    break;
                case 'dataset':
                    for (const [dataKey, dataValue] of Object.entries(value)) {
                        element.dataset[dataKey] = dataValue;
                    }
                    break;
                default:
                    (element as any)[key] = value;
                    break;
            }
        }
        return element;
    }

    static chartCard(title: string, canvas: HTMLCanvasElement, flex: number, minWidth: number): HTMLDivElement {
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
        }) as HTMLDivElement;
    }

    static link(href: string, title: string, text: string): HTMLAnchorElement {
        return Eli.build('a', {
            href: href,
            title: title,
            target: '_blank',
            rel: 'noopener',
            innerHTML: text,
        }) as HTMLAnchorElement;
    }

    static text(text: string): Text {
        return document.createTextNode(text);
    }

    static icon(icon: string): HTMLElement {
        return Eli.build('i', {
            className: 'material-icons',
            innerHTML: icon,
        });
    }

    static dialog(contents: Array<HTMLElement>): HTMLDivElement {
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
        }) as HTMLDivElement;
    }

    static dialogAction(action: string, text: string): HTMLButtonElement {
        return Eli.build('button', {
            className: 'mdc-button mdc-dialog__button',
            dataset: { mdcDialogAction: action, },
            children: [
                Eli.build('span', {
                    className: 'mdc-button__label', innerHTML: text
                }),
            ],
        }) as HTMLButtonElement;
    }

    static notchedOutline(labelOptions: any): HTMLDivElement {
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
        }) as HTMLDivElement;
    }
};

export default Eli;