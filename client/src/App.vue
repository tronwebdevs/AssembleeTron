<template>
    <v-app :style="{ backgroundColor: mainBgColor }">
        <v-main>
            <router-view></router-view>
        </v-main>
        <Footer />
    </v-app>
</template>

<script>
import Footer from '@/components/Footer';

export default {
    name: 'App',
    computed: {
        // Really bad but can't find another way
        mainBgColor() {
            return this.$vuetify.theme.isDark
                ? this.$vuetify.theme.themes.dark.backgroundPrimary
                : this.$vuetify.theme.themes.light.backgroundPrimary;
        }
    },
    mounted() {
        if (this.$store.state.assembly.pendings.info === undefined) {
            this.$store.dispatch('assembly/fetchAssemblyInfo');
        }
    },
    components: {
        Footer
    }
};
</script>

<style lang="scss">
// @import '~vuetify/src/styles/main.sass';

// div#app {
//     background-color: var(--v-accent-lighten2);
//     color: #1c2c41;
// }
</style>
