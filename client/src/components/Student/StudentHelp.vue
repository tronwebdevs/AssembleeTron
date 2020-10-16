<template>
    <div>
        <b-button
            v-b-toggle.help-collapse
            variant="link"
            block
            class="text-center text-muted my-2"
        >
            Dove trovo la mia matricola?
        </b-button>
        <b-collapse id="help-collapse">
            <b-card>
                <b-img
                    fluid
                    class="d-block mb-2"
                    :src="ExampleImg"
                    alt="Libretto Tron"
                ></b-img>
                <span>
                    Puoi trovare la tua matricola nel libretto delle assenze,
                    nella parte evidenziata in rosso in figura.
                </span>
                <br />
                <span>
                    Per altre domande o problemi rivolgiti ai rappresentanti o
                    al TronWeb.
                </span>
            </b-card>
        </b-collapse>
    </div>
</template>

<script>
import ExampleImg from '@/assets/libretto_tron.png';

export default {
    name: 'StudentHelp',
    computed: {
        ExampleImg: () => ExampleImg
    }
};
</script>

<style scoped>
button {
    font-size: 0.9rem;
}
</style>
