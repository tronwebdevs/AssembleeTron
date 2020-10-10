<template>
    <div class="student-home">
        <v-container>
            <v-row>
                <v-col class="loginCard mx-auto">
                    <FormCard
                        :loading="!notLoading"
                        :title="info.title"
                        :subtitle="date"
                        :centred="false"
                        text="Inserisci la tua matricola"
                    />
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import { DateTime } from 'luxon';
import FormCard from '@/components/FormCard';
import { mapGetters } from 'vuex';

export default {
    name: 'Home',
    computed: {
        ...mapGetters('assembly', ['pendings']),
        info() {
            return this.$store.state.assembly.info;
        },
        notLoading() {
            return this.pendings.info === false;
        },
        date() {
            console.log(DateTime.fromISO(this.info.date));
            return DateTime.fromISO(this.info.date)
                .setLocale('it')
                .toLocaleString();
        }
    },
    components: { FormCard }
};
</script>

<style scoped lang="scss">
@import '~vuetify/src/styles/styles.sass';

div.student-home {
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
