<template>
    <div class="student-labs-select">
        <b-container>
            <b-row>
                <b-col>
                    <h1 class="text-center my-4 page-title">Laboratori</h1>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="12" lg="8" class="pb-4">
                    <LabsList />
                </b-col>
                <b-col cols="12" lg="4">
                    <div style="position:sticky,top:1.5rem">
                        <b-row>
                            <b-col cols="12 mb-4">
                                <StudentBadge :student="profile" />
                            </b-col>
                            <b-col cols="12 mb-4">
                                <LabsSelectCard />
                            </b-col>
                            <b-col cols="12" class="pb-4">
                                <b-button
                                    block
                                    variant="outline-danger"
                                    @click="redirect"
                                    >Esci</b-button
                                >
                            </b-col>
                        </b-row>
                    </div>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import LabsSelectCard from '@/components/Student/LabsSelectCard';
import StudentBadge from '@/components/Student/StudentBadge';
import LabsList from '@/components/Student/LabsList';

export default {
    name: 'LabsSelect',
    computed: {
        ...mapGetters('student', ['profile'])
    },
    methods: {
        ...mapActions('student', ['logout']),
        redirect() {
            this.logout();
            this.$router.push({ name: 'Home' });
        }
    },
    components: {
        LabsSelectCard,
        StudentBadge,
        LabsList
    }
};
</script>
