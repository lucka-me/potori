<template>
<div class="info-block">
    <div class="row">
        <span>Comfirmed</span>
        <div class="divider"/>
        <span>{{ confirmedTime }}</span>
    </div>
    <div class="row">
        <span>{{ nomination.statusData.title }}</span>
        <div class="divider"/>
        <span>{{ resultTime }}</span>
    </div>
    <div class="row">
        <span>Scanner</span>
        <div class="divider"/>
        <span>{{ nomination.scannerData.title }}</span>
    </div>
    <hr v-if="rejected" />
    <div v-if="rejected" class="section-title">Reasons</div>
    <div v-for="reason in reasons" :key="reason.code" class="row">
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

import DetailsMap from './Map.vue';

@Options({
    props: {
        nomination: Nomination
    },
    components: {
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

        > span {
            @include typography.overflow-ellipsis;
        }

        > .divider {
            flex: 1;
            min-width: 0.5rem;
        }
    }

    > .map {
        @include shape.radius(medium);
        padding-top: 0.2rem;
        padding-bottom: 0.2rem;

        height: 20rem;
    }
}
</style>