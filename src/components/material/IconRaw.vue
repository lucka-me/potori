<template>
{{ symbol }}
</template>

<script lang="ts">
import { Vue, Prop } from 'vue-property-decorator';

const IconSymbolMap: Record<string, string> = {
    'search': '\uf002',
    'th-list'   : '\uf00b',
    'check' : '\uf00c',
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
    'chart-bar' : '\uf080',
    'globe' : '\uf0ac',
    'angle-up'  : '\uf106',
    'angle-down': '\uf107',
    'ellipsis-v': '\uf142',
    'trash' : '\uf1f8',
    'map'   : '\uf279',
    'sync-alt'  : '\uf2f1',
    'sign-in-alt'   : '\uf2f6',
    'redo-alt'  : '\uf2f9',
    'pen'   : '\uf304',
    'map-marker-alt': '\uf3c5',
    'mobile-alt': '\uf3cd',
    'tachometer-alt': '\uf3fd',
    'user-check': '\uf4fc',
    'brain' : '\uf5dc',
}

export default class MaterialIconRaw extends Vue {

    private static nameRegex = /^[a-z\-]+$/;

    @Prop(String) readonly icon!: string;

    get symbol(): string {
        if (MaterialIconRaw.nameRegex.test(this.icon)) {
            return IconSymbolMap[this.icon];
        } else {
            return this.icon;
        }
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