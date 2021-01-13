import i18next from 'i18next';
import { MDCSwitch } from '@material/switch';

import { eli } from '@lucka-labs/eli';
import { eliCard } from 'eli/card';
import { base } from 'ui/dashboard/base';
import { umi } from 'service/umi';

import './style.scss';

import { StringKey } from './constants';
import { eliSwitch } from 'eli/switch';

type StatusFilterMap = Map<umi.StatusCode, boolean>;
type ReasonFilterMap = Map<umi.ReasonCode, boolean>;

interface FilterCardEvents {
    switched: (status: StatusFilterMap, reason: ReasonFilterMap, reasonChanged: boolean) => void,
}

export default class FilterCard extends base.CardPrototype {

    status: Map<umi.StatusCode, MDCSwitch> = new Map();
    reason: Map<umi.ReasonCode, MDCSwitch> = new Map();

    events: FilterCardEvents = {
        switched: () => { },
    }

    render() {
        const statusBox = eli('div', { className: 'status-box' });
        const reasonBox = eli('div', { className: 'reason-box' });
        this.root = eliCard('filter-card', [
            eli('div', { className: 'content' }, [
                eli('span', { className: 'title', innerHTML: i18next.t(StringKey.title) }),
                statusBox,
                eli('span', { className: 'subtitle', innerHTML: i18next.t(StringKey.rejected) }),
                reasonBox,
            ]),
        ]);
        this.setVisible(false);
        this.parent.append(this.root);

        for (const status of umi.status.values()) {
            const switchCtrl = FilterCard.buildSwitch(statusBox, status, status.code);
            switchCtrl.listen('change', () => this.switchType(status.code, switchCtrl.checked));
            this.status.set(status.code, switchCtrl);
        }

        for (const [code, reason] of umi.reason) {
            if (code !== reason.code) continue;
            const switchCtrl = FilterCard.buildSwitch(reasonBox, reason, umi.StatusCode.Rejected);
            switchCtrl.listen('change', () => {
                this.switchReason(switchCtrl.checked);
            });
            this.reason.set(code, switchCtrl);
        }
    }

    private switchType(type: umi.StatusCode, checked: boolean) {
        let reasonChanged = false;
        if (type === umi.StatusCode.Rejected) {
            for (const ctrl of this.reason.values()) {
                ctrl.checked = checked;
            }
            reasonChanged = true;
        }
        this.switch(reasonChanged);
    }

    private switchReason(checked: boolean) {
        if (checked && !this.status.get(umi.StatusCode.Rejected).checked) {
            this.status.get(umi.StatusCode.Rejected).checked = true;
        }
        this.switch(true);
    }

    private switch(reasonChanged: boolean) {
        this.events.switched(this.statusFilterMap, this.reasonFilterMap, reasonChanged);
    }

    private get statusFilterMap(): StatusFilterMap {
        const map = new Map<umi.ReasonCode, boolean>();
        for (const [code, ctrl] of this.status) {
            map.set(code, ctrl.checked);
        }
        return map;
    }

    private get reasonFilterMap(): ReasonFilterMap {
        const map = new Map<umi.ReasonCode, boolean>();
        for (const [code, ctrl] of this.reason) {
            map.set(code, ctrl.checked);
        }
        return map;
    }

    private static buildSwitch(parent: HTMLElement, data: umi.Status | umi.Reason, status: umi.StatusCode) {
        const id = `switch-filter-${data.code}`;
        const element = eliSwitch(id);
        const box = eli('div', { }, [
            element,
            eli('label', {
                className: `fa fa-fw status-${status}`,
                for: id,
                title: i18next.t(data.title),
                innerHTML: data.icon,
            })
        ]);
        parent.append(box);
        const ctrl = new MDCSwitch(element);
        ctrl.checked = true;
        return ctrl;
    }
}