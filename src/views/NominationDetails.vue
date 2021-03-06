<template>
<material-top-app-bar :title="title"/>
<material-top-app-bar-adjust/>
<div class="nomination-details">
    <span v-if="nomination">{{ nomination.title }}</span>
    <span v-else>Not found</span>
    |
    <span @click="$router.back()">Back</span>
    <hr>
    <div v-if="nomination">
        Details...
    </div>
</div>
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