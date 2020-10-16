<template>
    <b-row>
        <b-col>
            <b-card>
                <small class="text-center info-sub-card">
                    <p class="font-weight-bold mb-1">
                        Conserva questa tabella! Ti consigliamo di salvare uno
                        screenshot di questa schermata prima di uscire.
                    </p>
                    <p class="font-weight-bold mb-1">
                        Potrai visualizzarla nuovamente inserendo la tua
                        matricola nella
                        <b-button variant="link" @click="redirect">
                            pagina di login
                        </b-button>
                    </p>
                    <p class="mb-0">
                        Per disiscriverti dall'assemblea vai alla
                        <b-button variant="link" @click="redirect">
                            pagina di login
                        </b-button>
                        e seleziona "Non partecipo"
                    </p>
                </small>
            </b-card>
        </b-col>
    </b-row>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'InfoBox',
    methods: {
        ...mapActions('student', ['logout']),
        redirect() {
            this.logout();
            this.$router.push({ name: 'Home' });
        }
    }
};
</script>

<style scoped>
button {
    font-size: 0.8rem;
    margin: 0;
    padding: 0;
}
</style>
