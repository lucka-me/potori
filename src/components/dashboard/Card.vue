<template>
<material-card class="dashboard-card">
    <div class="content">
        <div class="label">
            <span class="fa fa-fw"><material-icon-raw :icon="icon" /></span>
            <span class="title">{{ title }}</span>
        </div>
        <div class="text">{{ text }}</div>
    </div>
</material-card>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import MaterialCard from '@/components/material/Card.vue';
import MaterialIconRaw from '@/components/material/IconRaw.vue';

@Options({
    props: {
        icon: String,
        title: String,
        text: Number,
    },
    components: {
        MaterialCard, MaterialIconRaw
    },
})
export default class DashboardCard extends Vue {}
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

        > .text {
            @include typography.typography(headline2);
            margin-top: 0.1em;
        }
    }
}
</style>