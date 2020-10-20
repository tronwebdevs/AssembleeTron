<template>
    <authed-wrapper>
        <b-row>
            <b-col cols="12" :lg="exists ? '9' : '12'" class="mb-4">
                <b-card no-body>
                    <LabsTable />
                </b-card>
            </b-col>
            <b-col v-if="exists" cols="12" lg="3">
                <b-row>
                    <b-col cols="12" md="6" lg="12" class="mb-4">
                        <b-card>
                            <b-button
                                variant="success"
                                block
                                v-b-modal.modal-lab
                                >Crea</b-button
                            >
                            <b-button
                                variant="outline-primary"
                                block
                                v-b-modal.modal-exc-class
                                >Escludi classi</b-button
                            >
                            <b-button
                                variant="outline-info"
                                block
                                v-b-modal.modal-labs-check
                                >Controlla</b-button
                            >
                        </b-card>
                    </b-col>
                    <b-col cols="12" md="6" lg="12">
                        <LabsTutorial />
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
        <LabModal />
        <LabsCheckModal />
        <ExcClassModal />
    </authed-wrapper>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import authedwrapper from '@/components/Admin/authed-wrapper';
import LabsTutorial from '@/components/Admin/Help/LabsTutorial';
import LabModal from '@/components/Admin/Modal/Lab';
import LabsCheckModal from '@/components/Admin/Modal/LabsCheck';
import ExcClassModal from '@/components/Admin/Modal/ExcClass';
import LabsTable from '@/components/Admin/LabsTable';

export default {
    name: 'Labs',
    computed: {
        ...mapGetters('assembly', ['exists', 'pendings'])
    },
    methods: {
        ...mapActions('assembly', ['fetchAllLabs'])
    },
    mounted() {
        if (this.pendings.lab === undefined && this.exists) {
            this.fetchAllLabs();
        }
    },
    components: {
        'authed-wrapper': authedwrapper,
        LabsTutorial,
        LabModal,
        LabsCheckModal,
        ExcClassModal,
        LabsTable
    }
};
</script>
