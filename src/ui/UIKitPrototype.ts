import Eli from "./Eli";

export default class UIKitPrototype {
    
    parent: HTMLElement = null;

    constructor() {
        Object.defineProperty(this, 'parent', {
            enumerable: false,
        });
    }
    
    init(parent: HTMLElement) {
        this.parent = parent;
    }

    render() { }
}

export { Eli };