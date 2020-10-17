<template>
    <b-col cols="12" lg="4">
        <b-card>
            <template v-slot:header>
                Esporta l'assemblea
            </template>

            <span class="d-block mb-1">
                Al termine delle iscrizioni potrai scaricare il pdf per la
                security dalla sezione
                <router-link :to="{ name: 'Admin/Export' }">
                    esporta
                </router-link>
                , utilizzando l'apposito bottone
            </span>
        </b-card>
    </b-col>
</template>

<script>
export default {
    name: 'ExportAssembly'
};
</script>
