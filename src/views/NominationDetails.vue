<template>
<div class="nomination-details">
    <span v-if="nomination">Details</span>
    <span v-else>Not found</span>
    |
    <span @click="$router.back()">Back</span>
    <hr/>
</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import Nomination from '@/service/nomination';

@Options({
    components: {

    }
})
export default class NominationDetails extends Vue {
    nomination?: Nomination;
}
</script>