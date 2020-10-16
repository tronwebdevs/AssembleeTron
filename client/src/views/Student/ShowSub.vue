<template>
    <div class="student-show-sub">
        <b-container>
            <b-row>
                <b-col>
                    <h1 class="text-center my-4 page-title">
                        Iscrizioni per l'{{ info.title }}
                    </h1>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="12" lg="4" offset-lg="4" class="pb-4">
                    <StudentBadge :student="profile" />
                </b-col>
                <b-col cols="12" class="pb-2">
                    <NotPartCard v-if="notSub" />
                    <LabsTable v-else :labs="labs" />
                </b-col>
            </b-row>
            <InfoBox v-if="!notSub" />
        </b-container>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import StudentBadge from '@/components/Student/StudentBadge';
import InfoBox from '@/components/Student/InfoBox';
import LabsTable from '@/components/Student/LabsTable';
import NotPartCard from '@/components/Student/NotPartCard';

export default {
    name: 'ShowSub',
    computed: {
        ...mapGetters('student', ['profile', 'labs']),
        ...mapGetters('assembly', ['info']),
        notSub() {
            return this.labs.length === 0;
        }
    },
    components: {
        StudentBadge,
        NotPartCard,
        LabsTable,
        InfoBox
    }
};
</script>
