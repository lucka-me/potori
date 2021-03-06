<template>
<div class="dashboard">
    Dashboard
    |
    <router-link to="/preferences">Preferences</router-link>
    <hr/>
</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
    components: {

    },
})
export default class Dashboard extends Vue {
    
}
</script>
