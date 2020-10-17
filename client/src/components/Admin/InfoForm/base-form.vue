<template>
    <b-col cols="12" lg="4">
        <b-card class="mb-4">
            <template v-slot:header>{{ title }}</template>
            <b-form @submit.prevent="handleSubmit">
                <b-form-group
                    v-for="(input, index) in inputs"
                    :key="index"
                    :label="input.label"
                >
                    <b-input
                        :type="input.type"
                        :placeholder="input.placeholder"
                        v-model="values[input.name]"
                        :disabled="!editing || sending || input.name === 'id'"
                    ></b-input>
                    <b-form-invalid-feedback>{{
                        errors[input.name]
                    }}</b-form-invalid-feedback>
                </b-form-group>

                <div v-if="editing">
                    <b-button
                        type="submit"
                        variant="success"
                        size="sm"
                        class="mr-2"
                        :disabled="sending"
                        >Salva</b-button
                    >
                    <b-button
                        variant="danger"
                        size="sm"
                        @click="resetForm"
                        :disabled="sending"
                        >Annulla</b-button
                    >
                </div>
                <b-button
                    v-else
                    variant="info"
                    size="sm"
                    @click="editing = !editing"
                    >Modifica</b-button
                >
            </b-form>
        </b-card>
    </b-col>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Vue from 'vue';

export default {
    name: 'base-form',
    data() {
        return {
            editing: false,
            sending: false,
            values: {},
            errors: {}
        };
    },
    computed: {
        ...mapGetters('assembly', ['info'])
    },
    methods: {
        ...mapActions('assembly', ['updateAssemblyInfo']),
        resetForm() {
            this.editing = false;
            for (let input of this.inputs) {
                Vue.set(this.values, input.name, input.value);
                Vue.set(this.errors, input.name, null);
            }
        },
        handleSubmit() {
            this.sending = true;
            this.values.subOpen = this.info.subscription.open;
            this.values.subClose = this.info.subscription.close;
            let cInfo = { ...this.info, subscription: undefined };
            this.updateAssemblyInfo({
                ...cInfo,
                ...this.values
            }).finally(() => {
                this.sending = false;
                this.editing = false;
                this.resetForm();
            });
        }
    },
    created() {
        this.resetForm();
    },
    props: {
        title: String,
        inputs: Array
    }
};
</script>
