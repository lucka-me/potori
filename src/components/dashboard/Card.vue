<template>
<material-card class="dashboard-card">
    <div class="content">
        <div class="label">
            <material-icon :icon="icon" fixed-width/>
            <span class="title">{{ title }}</span>
        </div>
        <div class="count">{{ count }}</div>
    </div>
</material-card>
</template>

<script lang="ts">
import { Vue, Options, Prop } from 'vue-property-decorator';

import MaterialCard from '@/components/material/Card.vue';
import MaterialIcon from '@/components/material/Icon.vue';

@Options({
    components: {
        MaterialCard, MaterialIcon
    },
})
export default class DashboardCard extends Vue {
    @Prop(String) readonly icon!: string;
    @Prop(String) readonly title!: string;
    @Prop(Number) readonly count!: number;
}
</script>

<style lang="scss">
@use '~@material/typography';

.dashboard-card {

    .content {

        margin: 0.4em;
        overflow: hidden;

        > div {
            @include typography.overflow-ellipsis;
        }

        > .label {
            > .title {
                margin-inline-start: 0.2em;
            }
        }

        > .count {
            @include typography.typography(headline2);
            margin-top: 0.1em;
        }
    }
}
</style>