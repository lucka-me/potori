export namespace eliSVG {
    export type PartialStyle = Partial<CSSStyleDeclaration>;
    export type Options<K extends keyof SVGElementTagNameMap> = Omit<Omit<Partial<SVGElementTagNameMap[K]>, 'style'>, 'viewBox'> & {
        style?: PartialStyle;
        class?: string,
        viewBox?: string,
        fill?: string,
        stroke?: string,
        d?: string,
        [name: string]: any;
    };
}

export function eliSVG<K extends keyof SVGElementTagNameMap>(tag: K, options?: eliSVG.Options<K>, children?: Array<SVGElement | string>): SVGElementTagNameMap[K] {
    let element = document.createElementNS('http://www.w3.org/2000/svg', tag);
    if (options) {
        for (const [key, value] of Object.entries(options)) {
            if (key === 'style') {
                for (const [styleKey, styleValue] of Object.entries(value as eliSVG.PartialStyle)) {
                    (element.style as any)[styleKey] = styleValue;
                }
            } else if (key === 'dataset') {
                for (const [dataKey, dataValue] of Object.entries(value as DOMStringMap)) {
                    element.dataset[dataKey] = dataValue;
                }
            } else {
                element.setAttributeNS(null, key, value);
            }
        }
    }
    if (children) element.append(...children);
    return element;
}

