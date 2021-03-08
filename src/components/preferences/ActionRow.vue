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
        display: flex;
        flex-flow: row nowrap;

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
            min-width: 0.1em;
            flex: 1;
        }
    }
}
</style>