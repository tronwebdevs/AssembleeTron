<template>
    <b-card>
        <template v-slot:header>Scegli i laboratori</template>
        <b-alert variant="danger">bo frq errore</b-alert>
        <p class="tip">
            <u
                >Per i progetti da due ore seleziona la prima e la seconda ora,
                la terza e la quarta ora, ecc.</u
            >
        </p>
        <LabsSelectForm />
    </b-card>
</template>

<script>
import LabsSelectForm from '@/components/LabsSelectForm.vue';

export default {
    name: 'LabsSelectCard',
    components: {
        LabsSelectForm
    }
};
</script>

<style scoped>
p.tip {
    font-size: 0.9rem;
}
</style>
