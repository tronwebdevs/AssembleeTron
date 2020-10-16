<template>
    <b-card>
        <b-row>
            <LabsTableRow
                v-for="(lab, index) in labs"
                :lab="lab"
                :index="index"
                :borderBottom="index + 1 !== labs.length"
                :key="lab._id"
            />
        </b-row>
    </b-card>
</template>

<script>
import { mapGetters } from 'vuex';
import LabsTableRow from '@/components/Student/LabsTableRow';

export default {
    name: 'LabsTable',
    computed: {
        ...mapGetters('student', ['labs'])
    },
    components: {
        LabsTableRow
    }
};
</script>
