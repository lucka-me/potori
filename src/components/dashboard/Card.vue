<template>
<material-card class="dashboard-card">
    <div class="content">
        <div class="label">
            <span class="fa fa-fw"><material-icon :icon="icon" /></span>
            <span class="title">{{ title }}</span>
        </div>
        <div class="text">{{ text }}</div>
    </div>
</material-card>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import MaterialCard from '@/components/material/Card.vue';
import MaterialIcon from '@/components/material/Icon.vue';

@Options({
    props: {
        icon: String,
        title: String,
        text: Number,
    },
    components: {
        MaterialCard, MaterialIcon
    },
})
export default class DashboardCard extends Vue {}
</script>

<style lang="scss">
@use '~@material/typography';

.dashboard-card {

    .content {

        @include typography.overflow-ellipsis;

        margin: 0.4em;

        .label {
            > .title {
                margin-inline-start: 0.2em;
            }
        }

        .text {
            @include typography.typography(headline2);

            margin-top: 0.1em;
        }
    }
}
</style>