<template>
    <b-card :title="title" :class="[{ 'dark-theme': isDark }, 'tw-card']">
        <b-card-text>
            <slot name="b-card-text"></slot>
        </b-card-text>
        <slot></slot>
    </b-card>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'tw-card',
    computed: { ...mapGetters('preferences', ['isDark']) },
    props: {
        title: String
    }
};
</script>

<style lang="scss">
div.tw-card {
    background-color: $bgTirdaryLight;

    &.dark-theme {
        background-color: $bgTirdaryDark;
        color: #fff;
    }
}
</style>
