<template>
    <div class="student-home">
        <b-container>
            <b-row>
                <b-col class="loginCard mx-auto">
                    <FormCard
                        :loading="!notLoading"
                        :title="info.title"
                        :subtitle="date"
                        :centred="false"
                        text="Inserisci la tua matricola"
                    />
                    <StudentHelp />
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import { DateTime } from 'luxon';
import { mapGetters } from 'vuex';
import FormCard from '@/components/FormCard';
import StudentHelp from '@/components/StudentHelp';

export default {
    name: 'Home',
    computed: {
        ...mapGetters('assembly', ['info', 'pendings']),
        notLoading() {
            return this.pendings.info === false;
        },
        date() {
            return DateTime.fromISO(this.info.date)
                .setLocale('it')
                .toLocaleString();
        }
    },
    components: { FormCard, StudentHelp }
};
</script>

<style scoped lang="scss">
@import '~bootstrap';
@import '~bootstrap-vue';
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
