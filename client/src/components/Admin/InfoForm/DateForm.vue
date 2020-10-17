<template>
    <base-form
        title="Data e Fasce"
        :inputs="inputs"
        :handleSubmit="handleSubmit"
    ></base-form>
</template>

<script>
import { mapState } from 'vuex';
import { DateTime } from 'luxon';
import baseform from './base-form';

export default {
    name: 'DateForm',
    computed: {
        ...mapState(['assembly']),
        date() {
            return DateTime.fromISO(this.assembly.info.date)
                .setLocale('it')
                .toFormat('yyyy-LL-dd');
        },
        inputs() {
            return [
                {
                    label: 'Data',
                    name: 'date',
                    placeholder: '',
                    type: 'date',
                    value: this.date
                },
                {
                    label: 'Fasce',
                    name: 'tot_h',
                    placeholder: '',
                    type: 'number',
                    value: this.assembly.info.tot_h
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
