<template>
    <b-table
        hover
        responsive
        :busy="pendings.labs !== false"
        :items="labs"
        :fields="fields"
        show-empty
        empty-text="Nessun laboratorio disponibile"
        class="table-vcenter text-wrap labs-table"
        style="font-size: 0.85rem"
    >
        <template #table-busy>
            <div class="text-center my-4">
                <b-spinner></b-spinner>
            </div>
        </template>
        <template #cell(id)="data">
            {{ data.index + 1 }}
        </template>
    </b-table>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'LabsTable',
    data() {
        return {
            fields: [
                {
                    key: 'id',
                    label: '#',
                    sortable: true
                },
                {
                    key: 'title',
                    label: 'Titolo',
                    sortable: true
                },
                {
                    key: 'room',
                    label: 'Aula',
                    sortable: true
                }
            ]
        };
    },
    computed: {
        ...mapGetters('assembly', ['pendings', 'labs'])
    }
};
</script>
