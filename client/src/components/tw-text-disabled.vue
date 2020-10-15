<template>
    <span :class="[{ 'dark-theme': isDark }, 'tw-text-disabled']">
        <slot></slot>
    </span>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'tw-text-disabled',
    computed: {
        ...mapGetters('preferences', ['isDark'])
    }
};
</script>

<style lang="scss">
span.tw-text-disabled {
    color: $textDisabled;

    a {
        color: scale-color($color: $textDisabled, $alpha: -20%);
    }

    &.dark-theme {
        color: rgba($bgTirdaryLight, 0.3);
        a {
            color: rgba($bgTirdaryLight, 0.4);
        }
    }
}
</style>
