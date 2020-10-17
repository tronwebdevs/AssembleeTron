<template>
    <b-col cols="12">
        <b-card class="mb-4">
            <template v-slot:header>Classi partecipanti</template>
            <b-form @submit.prevent="handleSubmit">
                <b-form-group>
                    <b-row>
                        <b-col cols="4" lg="2" class="mb-2 mb-lg-0">
                            <b-form-checkbox :disabled="!editing">
                                1IC
                            </b-form-checkbox>
                            <b-form-checkbox :disabled="!editing">
                                1IC
                            </b-form-checkbox>
                            <b-form-checkbox :disabled="!editing">
                                1IC
                            </b-form-checkbox>
                            <b-form-checkbox :disabled="!editing">
                                1IC
                            </b-form-checkbox>
                            <b-form-checkbox :disabled="!editing">
                                1IC
                            </b-form-checkbox>
                            <b-form-checkbox :disabled="!editing">
                                1IC
                            </b-form-checkbox>
                        </b-col>
                        <b-col cols="4" lg="2" class="mb-2 mb-lg-0">
                            <b-form-checkbox :disabled="!editing">
                                1IC
                            </b-form-checkbox>
                            <b-form-checkbox :disabled="!editing">
                                1IC
                            </b-form-checkbox>
                            <b-form-checkbox :disabled="!editing">
                                1IC
                            </b-form-checkbox>
                            <b-form-checkbox :disabled="!editing">
                                1IC
                            </b-form-checkbox>
                            <b-form-checkbox :disabled="!editing">
                                1IC
                            </b-form-checkbox>
                            <b-form-checkbox :disabled="!editing">
                                1IC
                            </b-form-checkbox>
                        </b-col>
                        <b-col cols="4" lg="2" class="mb-2 mb-lg-0">
                            <b-form-checkbox :disabled="!editing">
                                1IC
                            </b-form-checkbox>
                            <b-form-checkbox :disabled="!editing">
                                1IC
                            </b-form-checkbox>
                            <b-form-checkbox :disabled="!editing">
                                1IC
                            </b-form-checkbox>
                            <b-form-checkbox :disabled="!editing">
                                1IC
                            </b-form-checkbox>
                            <b-form-checkbox :disabled="!editing">
                                1IC
                            </b-form-checkbox>
                            <b-form-checkbox :disabled="!editing">
                                1IC
                            </b-form-checkbox>
                        </b-col>
                        <b-col cols="4" lg="2" class="mb-2 mb-lg-0">
                            <b-form-checkbox :disabled="!editing">
                                1IC
                            </b-form-checkbox>
                            <b-form-checkbox :disabled="!editing">
                                1IC
                            </b-form-checkbox>
                            <b-form-checkbox :disabled="!editing">
                                1IC
                            </b-form-checkbox>
                            <b-form-checkbox :disabled="!editing">
                                1IC
                            </b-form-checkbox>
                            <b-form-checkbox :disabled="!editing">
                                1IC
                            </b-form-checkbox>
                            <b-form-checkbox :disabled="!editing">
                                1IC
                            </b-form-checkbox>
                        </b-col>
                        <b-col cols="4" lg="2" class="mb-2 mb-lg-0">
                            <b-form-checkbox :disabled="!editing">
                                1IC
                            </b-form-checkbox>
                            <b-form-checkbox :disabled="!editing">
                                1IC
                            </b-form-checkbox>
                            <b-form-checkbox :disabled="!editing">
                                1IC
                            </b-form-checkbox>
                            <b-form-checkbox :disabled="!editing">
                                1IC
                            </b-form-checkbox>
                            <b-form-checkbox :disabled="!editing">
                                1IC
                            </b-form-checkbox>
                            <b-form-checkbox :disabled="!editing">
                                1IC
                            </b-form-checkbox>
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
import { mapState } from 'vuex';

export default {
    name: 'SectionsForm',
    data() {
        return {
            editing: false
        };
    },
    computed: {
        ...mapState(['assembly'])
    },
    methods: {
        resetForm() {
            this.editing = false;
        },
        handleSubmit() {
            alert(3);
        }
    }
};
</script>
