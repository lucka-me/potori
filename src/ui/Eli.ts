class Eli {
    static build<K extends keyof HTMLElementTagNameMap>(
        tag: K, options: any, children?: Array<HTMLElement | string>
    ): HTMLElementTagNameMap[K] {
        const element = document.createElement(tag);
        for (const [key, value] of Object.entries(options)) {
            switch (key) {
                case 'cssText':
                    element.style.cssText = value as string;
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
        if (children) element.append(...children);
        return element;
    }

    static chartCard(
        title: string, canvas: HTMLCanvasElement, flex: number, minWidth: number
    ): HTMLDivElement {
        return Eli.build('div', {
            className: [
                'mdc-card',
                'mdc-card--outlined',
                'padding--8',
                `flex--${flex}`,
                'flex-shrink--1'
            ].join(' '),
            cssText: `min-width:${minWidth}px`,
        }, [
            Eli.build('span', {
                className: 'mdc-typography--headline6',
                innerHTML: title,
            }),
            Eli.build('div', {
                className: 'container-chart',
            }, [ canvas ]),
        ]);
    }

    static link(href: string, title: string, text: string): HTMLAnchorElement {
        return Eli.build('a', {
            href: href,
            title: title,
            target: '_blank',
            rel: 'noopener',
            innerHTML: text,
        });
    }

    static icon(icon: string): HTMLElement {
        return Eli.build('i', {
            className: `far fa-fw`,
            innerHTML: icon,
        });
    }

    static dialog(contents: Array<HTMLElement>): HTMLDivElement {
        return Eli.build('div', {
            className: 'mdc-dialog mdc-dialog--scrollable',
            role: 'dialog',
            ariaModal: true,
        }, [
            Eli.build('div', { className: 'mdc-dialog__container' }, [
                Eli.build('div', { className: 'mdc-dialog__surface' }, contents),
            ]),
            Eli.build('div', { className: 'mdc-dialog__scrim' }),
        ]);
    }

    static dialogAction(action: string, text: string): HTMLButtonElement {
        return Eli.build('button', {
            className: 'mdc-button mdc-dialog__button',
            dataset: { mdcDialogAction: action, },
        }, [
            Eli.build('span', {
                className: 'mdc-button__label', innerHTML: text
            }),
        ]);
    }

    static notchedOutline(labelOptions: any): HTMLDivElement {
        labelOptions.className = 'mdc-floating-label';
        return Eli.build('div', { className: 'mdc-notched-outline' }, [
            Eli.build('div', { className: 'mdc-notched-outline__leading' }),
            Eli.build('div', {
                className: 'mdc-notched-outline__notch',
            }, [ Eli.build('label', labelOptions), ]),
            Eli.build('div', { className: 'mdc-notched-outline__trailing' }),
        ]);
    }
};

export default Eli;