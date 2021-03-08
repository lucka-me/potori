<template>
<div class="action-row">
    <div class="text">
        <span>{{ text }}</span>
        <span v-if="desc" class="desc">{{ desc }}</span>
    </div>
    <div class="divider" />
    <div class="action">
        <slot />
    </div>
</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
    props: {
        text: String,
        desc: String
    },
    components: {
        
    },
})
export default class PreferenceActionRow extends Vue {
}
</script>

<style lang="scss">
@use '~@material/theme';
@use '~@material/typography';

.preferences {
    > .action-row {
        padding-top: 0.2em;
        padding-bottom: 0.2em;

        display: flex;
        flex-flow: row nowrap;
        align-items: center;

        > .text {
            display: flex;
            flex-flow: column nowrap;

            white-space: nowrap;
            @include typography.overflow-ellipsis;

            > .desc {
                @include typography.typography(body2);
                @include theme.property(color, text-secondary-on-light);
            }
        }

        > .divider {
            align-self: stretch;
            margin-inline-end: 0.2em;
            min-width: 0.2em;
            flex: 1;

            border-inline-end: 1px solid;
            @include theme.property(border-inline-end-color, text-secondary-on-light);
        }
    }
}
</style>