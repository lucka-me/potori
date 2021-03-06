<template>
<div class="nomination-list">
    Nominations
    |
    <router-link to="../">Back</router-link>
    <hr/>
</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
    components: {

    },
})
export default class NominationList extends Vue {
}
</script>