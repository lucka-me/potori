type PartialStyle = {
    [P in keyof CSSStyleDeclaration]?: CSSStyleDeclaration[P]
}

type EliOptions<K extends keyof HTMLElementTagNameMap> = {
    [P in keyof HTMLElementTagNameMap[K]]?: HTMLElementTagNameMap[K][P];
} & {
    styles?: PartialStyle;
    [name: string]: any;
}

export function eli<K extends keyof HTMLElementTagNameMap>(
    tag: K, options: EliOptions<K>, children?: Array<HTMLElement | SVGElement | string>
): HTMLElementTagNameMap[K] {
    const element = document.createElement(tag);
    for (const [key, value] of Object.entries(options)) {
        if (key === 'styles') {
            for (const [styleKey, styleValue] of Object.entries(value as PartialStyle)) {
                (element.style as any)[styleKey] = styleValue;
            }
        } else if (key === 'dataset') {
            for (const [dataKey, dataValue] of Object.entries(value as DOMStringMap)) {
                element.dataset[dataKey] = dataValue;
            }
        } else {
            (element as any)[key] = value;
        }
    }
    if (children) element.append(...children);
    return element;
}