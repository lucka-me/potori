<template>
<router-view/>
</template>

<style lang="scss">
@use '~@material/typography';
@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap');

body {
    margin: 0;
    padding-bottom: env(safe-area-inset-bottom);
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
}

#app {
    @include typography.base();
}
</style>
