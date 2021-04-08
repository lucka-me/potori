<template>
<div class="progress">
    <div class="text">
        <span>{{ text }}</span>
        <div class="spacer"/>
        <span v-if="determinate">{{ $store.state.progress.progress }} / {{ $store.state.progress.max }}</span>
    </div>
    <material-linear-progress :progress="progress" :determinate="determinate"/>
</div>
</template>

<script lang="ts">
import { Vue, Options, Prop } from 'vue-property-decorator';

import MaterialLinearProgress from '@/components/material/LinearProgress.vue';

@Options({
    components: {
        MaterialLinearProgress
    }
})
export default class LinearProgress extends Vue {

    @Prop(String) readonly text!: string;
    @Prop(Boolean) readonly determinate!: boolean;

    get progress(): number {
        return this.$store.state.progress.progress / this.$store.state.progress.max;
    }
}
</script>

<style lang="scss">
@use '~@material/typography';

.progress {

    > .text {
        display: flex;
        flex-flow: row nowrap;
        @include typography.overflow-ellipsis;

        > .spacer {
            flex: 1;
        }
    }

    > .mdc-linear-progress {
        margin-block-start: 0.4em;
    }
}
</style>