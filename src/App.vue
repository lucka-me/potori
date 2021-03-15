<template>
<router-view/>
</template>

<style lang="scss">
@use '~@material/typography';
@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap');

html {
    // Fix for iOS standalone mode
    height: calc(100% + env(safe-area-inset-top, 0));
}

body, #app {
    margin: 0;
    height: 100%;
}

#app {
    @include typography.base();
    display: flex;
    flex-flow: column nowrap;

    > main:not(.ignore-safe-area) {
        margin-bottom: env(safe-area-inset-bottom);
        margin-left: env(safe-area-inset-left);
        margin-right: env(safe-area-inset-right);
    }
}
</style>
