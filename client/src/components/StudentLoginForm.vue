<template>
    <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        @submit.prevent="handleSubmit"
    >
        <v-text-field
            label="Matricola"
            required
            autofocus
            :rules="studentIdRules"
            v-model="studentId"
        ></v-text-field>
        <v-radio-group :rules="partRules" row class="mt-0" v-model="part">
            <v-radio class="ml-auto" :value="1" label="Partecipo"></v-radio>
            <v-radio class="mr-auto" :value="0" label="Non partecipo"></v-radio>
        </v-radio-group>
        <v-btn color="primary" elevation="0" type="submit">Entra</v-btn>
    </v-form>
</template>

<script>
export default {
    name: 'StudentLoginForm',
    data() {
        return {
            valid: false,
            studentId: '',
            studentIdRules: [
                v => !!v || 'Matricola richiesta',
                v => !isNaN(v) || "Questa non e' una matricola"
            ],
            part: 1,
            partRules: [v => v === 0 || v === 1 || 'Selezione non valida'],
            remember: false
        };
    },
    methods: {
        handleSubmit() {
            if (this.$refs.form.validate()) {
                window.alert(`Matricola: ${this.studentId}`);
            }
        }
    }
};
</script>
