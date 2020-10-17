<template>
    <b-row>
        <b-col cols="12">
            <b-card>
                <template v-slot:header>
                    Nessuna assemblea esistente
                </template>
                <p>
                    Nessuna assemblea trovata sul database, procedi per crearne
                    una nuova
                </p>
                <span className="mr-3">
                    <router-link
                        :to="{ name: 'Admin/Crea' }"
                        class="btn btn-outline-success"
                    >
                        Crea nuova assemblea
                    </router-link>
                </span>
            </b-card>
        </b-col>
    </b-row>
</template>

<script>
export default {
    name: 'NoAssembly'
};
</script>
