<template>
<material-list-item :text="nomination.title" :secondary="time">
    <template #leading>
        <img :src="nomination.imageUrl" loading="lazy"/>
    </template>
    <template #meta>
        <material-icon :icon="nomination.statusData.icon" fixed-width/>
    </template>
</material-list-item>
</template>

<script lang="ts">
import { Vue, Options, Prop } from 'vue-property-decorator';

import Nomination from '@/service/nomination';
import { umi } from '@/service/umi';

import MaterialIcon from '@/components/material/Icon.vue';
import MaterialListItem from '@/components/material/ListItem.vue';

@Options({
    components: {
        MaterialListItem,
        MaterialIcon
    },
})
export default class NominationListRow extends Vue {

    @Prop(Nomination) readonly nomination!: Nomination;

    get time(): string {
        const time = this.nomination.status === umi.StatusCode.Pending ?
            this.nomination.confirmedTime : this.nomination.resultTime;
        return new Date(time).toLocaleDateString()
    }
}
</script>

<style lang="scss">

</style>