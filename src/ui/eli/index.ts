export namespace eli {
    /**
     * Build a HTML element
     * @param tag Element tag
     * @param options Element attributes
     * @param children Children of element
     */
    export function build<K extends keyof HTMLElementTagNameMap>(
        tag: K, options: any, children?: Array<HTMLElement | SVGElement | string>
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

    /**
     * Build a fontawesome icon element
     * @param icon Start with &#x
     */
    export function icon(icon: string): HTMLElement {
        return build('i', {
            className: 'fa fa-fw',
            innerHTML: icon,
        });
    }
};