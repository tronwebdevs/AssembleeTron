<template>
    <footer :style="{ backgroundColor: bgColor }">
        <v-container class="text-center pa-0">
            <small class="text--disabled"
                >Copyright © 2020
                <a href="https://www.tronweb.it" class="text--disabled">
                    TronWeb</a
                >
                | Made by Davide Testolin |
                <span
                    class="switchIcon"
                    @click="$vuetify.theme.dark = !$vuetify.theme.dark"
                    >switch-icon.meta</span
                >
            </small>
        </v-container>
    </footer>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'Footer',
    computed: {
        // Really bad but can't find another way
        bgColor() {
            return this.$vuetify.theme.isDark
                ? this.$vuetify.theme.themes.dark.backgroundSecondary
                : this.$vuetify.theme.themes.light.backgroundSecondary;
        }
    },
    methods: {
        ...mapActions('preferences', ['switchTheme'])
    }
};
</script>

<style scoped lang="scss">
footer {
    height: 60px;
    line-height: 60px;
}

span.switchIcon {
    padding: 0px 10px;
    cursor: pointer;
}
</style>
