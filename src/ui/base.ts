import i18next from 'i18next';
import { service, Nomination, LngLat, BrainstormingStats, RateItems, Status, StatusType, StatusReason } from "../service";
import { eli } from "./eli";

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

export { i18next };
export { eli };
export { BrainstormingStats, RateItems };
export { service, Nomination, LngLat };
export { Status, StatusType, StatusReason };