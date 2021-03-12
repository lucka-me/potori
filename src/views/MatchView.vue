<template>
<material-top-app-bar title="Match" navi-back/>
<material-top-app-bar-adjust/>
<main>
</main>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import MaterialTopAppBar from '@/components/material/TopAppBar.vue';
import MaterialTopAppBarAdjust from '@/components/material/TopAppBarAdjust.vue';

@Options({
    components: {
        MaterialTopAppBar, MaterialTopAppBarAdjust,
    },
})
export default class MatchView extends Vue {

}
</script>

<style lang="scss">

</style>