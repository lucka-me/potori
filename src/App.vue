<template>
<router-view/>
</template>

<style lang="scss">
@use '~@material/typography';
@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap');

body {
    margin: 0;
}

#app {
    @include typography.base();

    > main {
        margin-bottom: env(safe-area-inset-bottom);
        margin-left: env(safe-area-inset-left);
        margin-right: env(safe-area-inset-right);
    }
}
</style>
