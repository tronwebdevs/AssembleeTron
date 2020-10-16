<template>
    <div class="wrapper">
        <b-container>
            <b-row>
                <b-col class="loginCard mx-auto">
                    <slot></slot>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
export default {
    name: 'centred-div'
};
</script>

<style scoped lang="scss">
@import '~bootstrap';
@import '~bootstrap-vue';
div.wrapper {
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    @include media-breakpoint-up(lg) {
        top: 50%;
        transform: translate(-50%, -50%);
    }
}
.loginCard {
    max-width: 24rem;
}
</style>
