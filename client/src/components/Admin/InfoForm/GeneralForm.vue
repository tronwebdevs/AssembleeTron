<template>
    <base-form
        title="Generali"
        :inputs="inputs"
        :handleSubmit="handleSubmit"
    ></base-form>
</template>

<script>
import { mapState } from 'vuex';
import baseform from './base-form';

export default {
    name: 'GeneralForm',
    computed: {
        ...mapState(['assembly']),
        inputs() {
            return [
                {
                    label: 'Titolo',
                    name: 'title',
                    placeholder: 'Nome assemblea',
                    type: 'text',
                    value: this.assembly.info.title
                },
                {
                    label: 'Identificativo',
                    name: 'id',
                    placeholder: 'Generato automaticamente',
                    type: 'text',
                    value: this.assembly.info._id
                }
            ];
        }
    },
    methods: {
        handleSubmit() {
            alert(1);
        }
    },
    components: {
        'base-form': baseform
    }
};
</script>
