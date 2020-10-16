<template>
    <centred-div>
        <b-card title="Errore 404">
            <template v-slot:header>
                <div class="text-center icon-wrapper">
                    <b-icon-exclamation-triangle></b-icon-exclamation-triangle>
                </div>
            </template>
            <span>Pagina non trovata</span>
        </b-card>
    </centred-div>
</template>

<script>
import centreddiv from '@/components/centred-div';

export default {
    name: 'NotFound',
    components: {
        'centred-div': centreddiv
    }
};
</script>

<style scoped>
div.icon-wrapper {
    font-size: 3rem;
}
</style>
