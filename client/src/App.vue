<template>
    <div id="app">
        <main :class="{ 'dark-theme': isDark }">
            <router-view />
        </main>
        <Footer />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Footer from '@/components/Footer';

export default {
    name: 'App',
    computed: {
        ...mapGetters('preferences', ['isDark'])
    },
    components: {
        Footer
    }
};
</script>

<style lang="scss">
@import './scss/_variables.scss';
body,
html,
#app {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}

main {
    background-color: $bgPrimaryLight;
    width: 100%;
    height: calc(100% - 60.5px);

    &.dark-theme {
        background-color: $bgPrimaryDark;
    }
}
</style>
