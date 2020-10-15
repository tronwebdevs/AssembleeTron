<template>
    <smart-card title="Scegli i laboratori">
        <v-alert type="error">bo frq errore</v-alert>
        <p class="px-4 my-0">
            <u
                >Per i progetti da due ore seleziona la prima e la seconda ora o
                la terza e la quarta ora.</u
            >
        </p>
        <LabsSelectForm />
    </smart-card>
</template>

<script>
import smartcard from '@/components/smart-card.vue';
import LabsSelectForm from '@/components/LabsSelectForm.vue';

export default {
    name: 'LabsSelectCard',
    components: {
        'smart-card': smartcard,
        LabsSelectForm
    }
};
</script>
