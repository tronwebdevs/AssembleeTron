<template>
    <footer class="border-top">
        <b-container class="text-center">
            <span class="text-muted footer-span">
                Copyright © {{ date }}
                <a href="https://www.tronweb.it"> TronWeb</a> | Made by Davide
                Testolin |
                <span
                    @click="switchTheme"
                    class="switchIcon"
                    :style="{ 'user-select': 'none', cursor: 'pointer' }"
                >
                    <b-icon-moon v-if="isDark"></b-icon-moon>
                    <b-icon-brightness-high v-else></b-icon-brightness-high>
                </span>
            </span>
        </b-container>
    </footer>
</template>

<script>
import { DateTime } from 'luxon';
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'Footer',
    computed: {
        ...mapGetters('preferences', ['isDark']),
        date() {
            return DateTime.local()
                .setLocale('it')
                .toFormat('yyyy');
        }
    },
    methods: {
        ...mapActions('preferences', ['switchTheme'])
    }
};
</script>

<style scoped lang="scss">
@import '~bootstrap';
@import '~bootstrap-vue';

footer {
    height: 60px;
    line-height: 60px;
    background-color: $bgSecondaryLight;

    span {
        font-size: 0.9rem;

        @include media-breakpoint-down(md) {
            font-size: 0.75rem !important;
        }
    }
}

span.switchIcon {
    padding: 0px 5px;
}
</style>
