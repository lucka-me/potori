<template>
{{ symbol }}
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

const IconSymbolMap: Record<string, string> = {
    'search': '\uf002',
    'th-list'   : '\uf00b',
    'times' : '\uf00d',
    'cog'   : '\uf013',
    'clock' : '\uf017',
    'redo'  : '\uf01e',
    'edit'  : '\uf044',
    'info-circle'   : '\uf05a',
    'arrow-left': '\uf060',
    'arrow-up'  : '\uf062',
    'plus'  : '\uf067',
    'calendar-alt'  : '\uf073',
    'folder-open'   : '\uf07c',
    'globe' : '\uf0ac',
    'angle-up'  : '\uf106',
    'angle-down': '\uf107',
    'ellipsis-v': '\uf142',
    'trash' : '\uf1f8',
    'sync-alt'  : '\uf2f1',
    'sign-in-alt'   : '\uf2f6',
    'redo-alt'  : '\uf2f9',
    'map-marker-alt': '\uf3c5',
    'tachometer-alt': '\uf3fd',
    'brain' : '\uf5dc',
}

@Options({
    props: {
        name: String
    },
})
export default class MaterialIcon extends Vue {
    name!: string;
    get symbol() {
        return IconSymbolMap[this.name];
    }
}
</script>

<style lang="scss">
$fa-font-path: '~@fortawesome/fontawesome-free/webfonts';
@import '~@fortawesome/fontawesome-free/scss/solid';
@import '~@fortawesome/fontawesome-free/scss/mixins';
@import '~@fortawesome/fontawesome-free/scss/core';
@import '~@fortawesome/fontawesome-free/scss/fixed-width';
</style>