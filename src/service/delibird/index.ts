import { MessageCallback } from "@/service/types";

export namespace delibird {
    interface Events {
        alert   : MessageCallback,  // Triggered when alert raised
        inform  : MessageCallback,  // Triggered when some information should be passed to user
    }

    export const events: Events = {
        alert   : () => { },
        inform  : () => { },
    }

    export function alert(message: string) {
        events.alert(message);
    }

    export function inform(message: string) {
        events.inform(message);
    }
}