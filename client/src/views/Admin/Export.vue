<template>
    <authed-wrapper>
        <b-row>
            <b-col cols="12" lg="6">
                <b-card>
                    <template v-slot:header>
                        PDF
                    </template>
                    <p>
                        Genera PDF degli iscritti all'assemblea per la security
                        (operazione possibile solo al termine delle iscrizioni)
                    </p>
                    <b-overlay
                        :show="loading"
                        rounded
                        opacity="0.6"
                        spinner-small
                        spinner-variant="primary"
                        class="d-inline-block"
                    >
                        <b-button variant="primary" @click="requestGenPdf"
                            >Genera PDF</b-button
                        >
                    </b-overlay>
                </b-card>
            </b-col>
            <b-col cols="12" lg="6">
                <b-card>
                    <template v-slot:header>
                        JSON
                    </template>
                    <p>
                        Backup presenti sul server delle assemblee passate
                    </p>
                    <small class="text-muted d-block text-center"
                        >Lista in arrivo</small
                    >
                </b-card>
            </b-col>
        </b-row>
    </authed-wrapper>
</template>

<script>
import { mapActions } from 'vuex';
import authedwrapper from '@/components/Admin/authed-wrapper';

export default {
    name: 'Export',
    data() {
        return {
            loading: false
        };
    },
    methods: {
        ...mapActions('assembly', ['generatePdf']),
        requestGenPdf() {
            this.loading = true;
            this.generatePdf().finally(() => (this.loading = false));
        }
    },
    components: {
        'authed-wrapper': authedwrapper
    }
};
</script>
