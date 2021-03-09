<template>
<material-top-app-bar :title="title" navi-back/>
<material-top-app-bar-adjust>
    <div v-if="nomination" class="nomination-details">
        Details...
    </div>
</material-top-app-bar-adjust>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import Nomination from '@/service/nomination';

import MaterialTopAppBar from '@/components/material/TopAppBar.vue';
import MaterialTopAppBarAdjust from '@/components/material/TopAppBarAdjust.vue';

@Options({
    components: {
        MaterialTopAppBar, MaterialTopAppBarAdjust,
    }
})
export default class NominationDetails extends Vue {

    nomination?: Nomination;

    get title(): string {
        return this.nomination?.title ?? 'Not Found';
    }

    created() {
        const id = this.$route.query.id;
        if (id && typeof(id) === 'string') {
            const nomination = this.$store.state.nominations.find((nomination) => nomination.id === id);
            if (nomination) {
                this.nomination = nomination;
            }
        }
    }
}
</script>

<style lang="scss">

</style>