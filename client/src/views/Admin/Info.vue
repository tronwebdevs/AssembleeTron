<template>
    <authed-wrapper>
        <b-row>
            <b-col cols="12">
                <InfoForm v-if="exists" />
                <b-card v-else>
                    <p>
                        Devi creare un'assemblea prima di poter visualizzare le
                        informazioni
                    </p>
                </b-card>
            </b-col>
        </b-row>
    </authed-wrapper>
</template>

<script>
import { mapGetters } from 'vuex';
import authedwrapper from '@/components/Admin/authed-wrapper';
import InfoForm from '@/components/Admin/InfoForm/';

export default {
    name: 'Info',
    computed: {
        ...mapGetters('assembly', ['exists'])
    },
    components: {
        'authed-wrapper': authedwrapper,
        InfoForm
    }
};
</script>
