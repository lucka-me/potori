import i18next from 'i18next';
import { service, Nomination, LngLat, BrainstormingStats, RateItems, Status, StatusType, StatusReason } from "../service";

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
export { service, Nomination, LngLat };
export { BrainstormingStats, RateItems };
export { Status, StatusType, StatusReason };