namespace eli {
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