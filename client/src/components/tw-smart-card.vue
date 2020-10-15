<template>
    <v-sheet color="backgroundPrimary" elevation="1" outlined rounded>
        <div class="text-left">
            <div class="card-header pa-4" :style="{ backgroundColor: headerBg }" v-if="title">
                <b>{{ title }}</b>
            </div>
            <div class="card-content">
                <slot></slot>
            </div>
        </div>
    </v-sheet>
</template>

<script>
export default {
    name: 'smart-card',
    computed: {
        isDarkThemeOn() {
            return this.$vuetify.theme.isDark;
        },
        cardBg() {
            return this.isDarkThemeOn
                ? this.$vuetify.theme.themes.dark.backgroundPrimary
                : this.$vuetify.theme.themes.light.backgroundPrimary;
        },
        headerBg() {
            if (this.isDarkThemeOn) {
                const { backgroundSecondary } = this.$vuetify.theme.themes.dark;
                let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
                    backgroundSecondary
                );
                let rgb = result
                    ? {
                          r: parseInt(result[1], 16),
                          g: parseInt(result[2], 16),
                          b: parseInt(result[3], 16)
                      }
                    : null;
                if (rgb) {
                    return `rgba(${rgb.r}, ${rgb.r}, ${rgb.b}, 0.4)`;
                }
                return '';
            } else {
                return this.$vuetify.theme.themes.light.footerBackground;
            }
        }
    },
    props: {
        title: String
    }
};
</script>

<style scoped>
div.card-header {
    border-bottom: thin solid rgba(0, 0, 0, 0.12);
}
</style>
