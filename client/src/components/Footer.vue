<template>
    <footer :class="{ 'dark-theme': isDark }">
        <b-container class="text-center">
            <tw-text-disabled>
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
            </tw-text-disabled>
        </b-container>
    </footer>
</template>

<script>
import twtextdisabled from '@/components/tw-text-disabled';
import { DateTime } from 'luxon';
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'Footer',
    computed: {
        ...mapGetters('preferences', ['isDark']),
        date() {
            return DateTime.local()
                .setLocale('it')
                .toFormat('kkkk');
        }
    },
    methods: {
        ...mapActions('preferences', ['switchTheme'])
    },
    components: {
        'tw-text-disabled': twtextdisabled
    }
};
</script>

<style lang="scss">
footer {
    height: 60px;
    line-height: 60px;
    background-color: $bgSecondaryLight;
    font-size: 0.9rem;

    &.dark-theme {
        background-color: $bgSecondaryDark;
    }
}

span.switchIcon {
    padding: 0px 5px;
}
</style>
