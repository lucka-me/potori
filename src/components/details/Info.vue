<template>
<div class="info-block">
    <div class="row">
        <material-icon icon="arrow-up" fixed-width/>
        <span>Comfirmed</span>
        <div class="spacer"/>
        <span>{{ confirmedTime }}</span>
    </div>
    <div class="row">
        <material-icon :icon="nomination.statusData.icon" fixed-width/>
        <span>{{ nomination.statusData.title }}</span>
        <div class="spacer"/>
        <span>{{ resultTime }}</span>
    </div>
    <div class="row">
        <material-icon icon="mobile-alt" fixed-width/>
        <span>Scanner</span>
        <div class="spacer"/>
        <span>{{ nomination.scannerData.title }}</span>
    </div>
    <hr v-if="rejected" />
    <div v-if="rejected" class="section-title">Reasons</div>
    <div v-for="reason in reasons" :key="reason.code" class="row">
        <material-icon :icon="reason.icon" fixed-width/>
        <span>{{ reason.title }}</span>
    </div>
    <hr v-if="nomination.lngLat"/>
    <div v-if="nomination.lngLat" class="section-title">Location</div>
    <details-map v-if="nomination.lngLat" :lngLat="nomination.lngLat"/>
</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import Nomination from '@/service/nomination';
import { umi } from '@/service/umi';

import MaterialIcon from '@/components/material/Icon.vue';
import DetailsMap from './Map.vue';

@Options({
    props: {
        nomination: Nomination
    },
    components: {
        MaterialIcon,
        DetailsMap,
    }
})
export default class NominationDetails extends Vue {

    nomination!: Nomination;

    get confirmedTime(): string {
        return new Date(this.nomination.confirmedTime).toLocaleDateString();
    }

    get resultTime(): string {
        if (this.nomination.status === umi.StatusCode.Pending) return '';
        return new Date(this.nomination.resultTime).toLocaleDateString();
    }

    get rejected(): boolean {
        return this.nomination.status === umi.StatusCode.Rejected;
    }

    get reasons(): Array<umi.Reason> {
        if (!this.rejected) return [];
        if (this.nomination.reasons.length < 1) return [ umi.reason.get(umi.Reason.undeclared)! ];
        return this.nomination.reasonsData;
    }
}
</script>

<style lang="scss">
@use "~@material/shape";
@use '~@material/theme';
@use '~@material/typography';

.info-block {
    flex: 2;
    display: flex;
    flex-flow: column nowrap;
    align-items: stretch;

    > .section-title {
        @include typography.typography(overline);
    }

    > hr {
        border: none;
        height: 1px;
        width: 100%;
        border-top: 1px solid;
        @include theme.property(border-top-color, text-secondary-on-light);
    }

    > .row {
        padding-top: 0.2rem;
        padding-bottom: 0.2rem;
        display: flex;
        flex-flow: row nowrap;
        align-items: baseline;

        overflow: hidden;

        > i {
            margin-inline-end: 0.2em;
        }

        > span {
            @include typography.overflow-ellipsis;
        }

        > .spacer {
            flex: 1;
            min-width: 0.5rem;
        }
    }

    > .map {
        @include shape.radius(medium);
        clip-path: inset(100% round 4px);
        -webkit-clip-path: inset(0 round 4px);
        padding-top: 0.2rem;
        padding-bottom: 0.2rem;

        height: 20rem;
    }
}
</style>