<template>
<router-view/>
</template>

<style lang="scss">
@use '~@material/typography';
@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap');

#app {
    @include typography.base();
}
</style>
