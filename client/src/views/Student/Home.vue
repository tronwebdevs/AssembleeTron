<template>
    <centred-div>
        <form-card
            :loading="!notLoading"
            :title="info.title"
            :subtitle="date"
            :centred="false"
            text="Inserisci la tua matricola"
        >
            <LoginForm v-if="exists" />
        </form-card>
        <StudentHelp v-if="info._id" />
    </centred-div>
</template>

<script>
import { DateTime } from 'luxon';
import { mapGetters } from 'vuex';
import centreddiv from '@/components/centred-div';
import formcard from '@/components/form-card';
import LoginForm from '@/components/Student/LoginForm';
import StudentHelp from '@/components/Student/StudentHelp';

export default {
    name: 'Home',
    computed: {
        ...mapGetters('assembly', ['info', 'pendings', 'exists']),
        notLoading() {
            return this.pendings.info === false;
        },
        date() {
            return DateTime.fromISO(this.info.date)
                .setLocale('it')
                .toLocaleString();
        }
    },
    components: {
        'form-card': formcard,
        'centred-div': centreddiv,
        StudentHelp,
        LoginForm
    }
};
</script>
