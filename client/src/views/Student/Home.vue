<template>
    <centred-div>
        <FormCard
            :loading="!notLoading"
            :title="info.title"
            :subtitle="date"
            :centred="false"
            text="Inserisci la tua matricola"
        />
        <StudentHelp v-if="info._id" />
    </centred-div>
</template>

<script>
import { DateTime } from 'luxon';
import { mapGetters } from 'vuex';
import centreddiv from '@/components/centred-div';
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
    components: { FormCard, StudentHelp, 'centred-div': centreddiv }
};
</script>
