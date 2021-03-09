<template>
<div class="actions-block">
    <img :src="nomination.imageUrl"/>
    <div class="actions">
        <material-icon-button v-if="nomination.lngLat" icon="globe" @click="openIntel"/>
        <material-icon-button icon="brain" @click="openBs"/>
    </div>
</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import Nomination from '@/service/nomination';

import MaterialIconButton from '@/components/material/IconButton.vue';

@Options({
    props: {
        nomination: Nomination
    },
    components: {
        MaterialIconButton,
    }
})
export default class ActionsBlock extends Vue {

    nomination!: Nomination;

    openIntel() {
        window.open(this.nomination.intelUrl, '_blank');
    }

    openBs() {
        window.open(this.nomination.bsUrl, '_blank');
    }
}
</script>

<style lang="scss">
@use "~@material/shape";

.actions-block {
    flex: 1;
    max-width: 30rem;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    padding-top: 0.5rem;

    > img {
        @include shape.radius(medium);

        width: 100%;
        max-width: 20rem;
        width: 100%;
        max-height: 20rem;
        object-fit: cover;
        object-position: center;
    }

    > .actions {
        margin-top: 0.5rem;

        display: flex;
        flex-flow: row wrap;
        justify-content: center;
    }
}
</style>