<template>
<div class="match-pack">
    <div class="target">
        <div class="title">{{ pack.target.title }}</div>
        <div class="details">
            <div>
                <material-icon icon="mobile-alt" fixed-width/>
                <span>{{ scannerTitle }}</span>
            </div>
            <div>
                <material-icon :icon="statusIcon" fixed-width/>
                <span>{{ getTimeString(pack.target.resultTime) }}</span>
            </div>
        </div>
    </div>
    <div class="candiddates-title">{{ $t('candidates') }}</div>
    <div class="candidates">
        <material-card
            v-for="candidate of pack.candidates" :key="candidate.id"
            :image="candidate.image"
            @click="select(candidate.id)"
        >
            <div class="content">
                <material-icon icon="arrow-up" fixed-width/>
                <span>{{ getTimeString(candidate.confirmedTime) }}</span>
                <div/>
                <material-icon v-if="candidate.id === pack.selected" icon="check" fixed-width/>
            </div>
        </material-card>
    </div>
</div>
</template>

<script lang="ts">
import { Vue, Options, Prop } from 'vue-property-decorator';

import { service } from '@/service';
import { umi } from '@/service/umi';

import MaterialCard from '@/components/material/Card.vue';
import MaterialIcon from '@/components/material/Icon.vue';

import locales from './Pack.locales.json';

@Options({
    components: {
        MaterialCard,
        MaterialIcon
    },
    i18n: {
        messages: locales
    }
})
export default class MatchPackView extends Vue {

    @Prop(Object) readonly pack!: service.MatchPack;

    get scannerTitle(): string {
        return umi.scanner.get(this.pack.target.scanner)!.title;
    }

    get statusIcon(): string {
        return umi.status.get(this.pack.target.status)!.icon;
    }

    getTimeString(time: number) {
        return new Date(time).toLocaleString()
    }

    select(id: string) {
        this.pack.selected = id;
    }
}
</script>

<style lang="scss">
@use '~@material/theme';
@use '~@material/typography';

.match-pack {

    &:not(:first-child) {
        margin-block-start: 0.6rem;
        border-block-start: 1px solid;
        @include theme.property(border-block-start-color, text-secondary-on-light);
    }

    > .target {
        > .title {
            @include typography.typography(headline6);
        }

        > .details {
            @include typography.typography(body2);
            @include theme.property(color, text-secondary-on-light);
            display: flex;
            flex-flow: row wrap;
            align-items: baseline;

            > div {
                margin-inline-end: 0.4em;

                > i {
                    margin-inline-end: 0.2em;
                }
            }
        }
    }

    > .candiddates-title {
        @include typography.typography(overline);
    }

    > .candidates {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
        gap: 0.6rem;

        > .mdc-card {
            cursor: pointer;

            .content {
                @include typography.typography(body2);
                @include theme.property(color, text-secondary-on-light);
                padding: 1rem;
                display: flex;
                flex-flow: row nowrap;
                align-items: baseline;
                overflow: hidden;

                > span {
                    @include typography.overflow-ellipsis;
                    margin-inline-start: 0.2em;
                }

                > div {
                    flex: 1;
                }
            }
        }
    }
}
</style>