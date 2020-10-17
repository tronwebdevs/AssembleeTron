<template>
    <b-col cols="12" lg="4">
        <b-card class="mb-4">
            <template v-slot:header>Iscrizioni</template>
            <b-form @submit.prevent="handleSubmit">
                <b-form-group label="Aperura iscrizioni">
                    <b-row>
                        <b-col cols="12" lg="6" class="mb-2 mb-lg-0">
                            <b-input
                                type="date"
                                v-model="values.openDate"
                                :disabled="!editing"
                            ></b-input>
                            <b-form-invalid-feedback>{{
                                errors.openDate
                            }}</b-form-invalid-feedback>
                        </b-col>
                        <b-col cols="12" lg="6" class="mb-2 mb-lg-0">
                            <b-input
                                type="time"
                                v-model="values.openTime"
                                :disabled="!editing"
                            ></b-input>
                            <b-form-invalid-feedback>{{
                                errors.openTime
                            }}</b-form-invalid-feedback>
                        </b-col>
                    </b-row>
                </b-form-group>
                <b-form-group label="Chiusura iscrizioni">
                    <b-row>
                        <b-col cols="12" lg="6" class="mb-2 mb-lg-0">
                            <b-input
                                type="date"
                                v-model="values.closeDate"
                                :disabled="!editing"
                            ></b-input>
                            <b-form-invalid-feedback>{{
                                errors.closeDate
                            }}</b-form-invalid-feedback>
                        </b-col>
                        <b-col cols="12" lg="6" class="mb-2 mb-lg-0">
                            <b-input
                                type="time"
                                v-model="values.closeTime"
                                :disabled="!editing"
                            ></b-input>
                            <b-form-invalid-feedback>{{
                                errors.closeTime
                            }}</b-form-invalid-feedback>
                        </b-col>
                    </b-row>
                </b-form-group>

                <div v-if="editing">
                    <b-button
                        type="submit"
                        variant="success"
                        size="sm"
                        class="mr-2"
                        >Salva</b-button
                    >
                    <b-button
                        variant="outline-danger"
                        size="sm"
                        @click="resetForm"
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
import { mapState, mapActions } from 'vuex';
import { DateTime, Settings } from 'luxon';

Settings.defaultLocale = 'it';

export default {
    name: 'SubsForm',
    data() {
        return {
            editing: false,
            values: {},
            errors: {}
        };
    },
    computed: {
        ...mapState(['assembly'])
    },
    methods: {
        ...mapActions('assembly', ['updateAssemblyInfo']),
        handleSubmit() {
            let cInfo = { ...this.assembly.info, subscription: undefined };
            const { openDate, openTime, closeDate, closeTime } = this.values;
            let subOpen = DateTime.fromISO(openDate + 'T' + openTime).toISO();
            let subClose = DateTime.fromISO(
                closeDate + 'T' + closeTime
            ).toISO();
            this.updateAssemblyInfo({
                ...cInfo,
                subOpen,
                subClose
            }).finally(() => {
                this.editing = false;
                this.resetForm();
            });
        },
        resetForm() {
            this.editing = false;
            let open = DateTime.fromISO(this.assembly.info.subscription.open);
            let close = DateTime.fromISO(this.assembly.info.subscription.close);
            this.values.openTime = open.toFormat('HH:mm');
            this.values.openDate = open.toFormat('yyyy-LL-dd');
            this.values.closeTime = close.toFormat('HH:mm');
            this.values.closeDate = close.toFormat('yyyy-LL-dd');
        }
    },
    created() {
        this.resetForm();
    }
};
</script>
