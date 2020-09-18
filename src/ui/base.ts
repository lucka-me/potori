/**
 * Prototype of UI components
 */
export default class UIPrototype {
    
    parent: HTMLElement = null; // Parent element, not enumerable

    constructor() {
        Object.defineProperty(this, 'parent', {
            enumerable: false,
        });
    }
    
    /**
     * Initialize and setup component
     * @param parent Parent element
     */
    init(parent: HTMLElement) {
        this.parent = parent;
    }

    /**
     * Build element and render
     */
    render() { }
}