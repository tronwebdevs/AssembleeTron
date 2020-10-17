<template>
    <b-form @submit.prevent="handleSubmit" autocomplete="off">
        <b-form-group>
            <b-input
                v-model="studentId"
                placeholder="Matricola"
                class="student-id-input"
                autofocus
                type="text"
                :disabled="loading"
                :state="error === null ? error : false"
            ></b-input>
            <b-form-invalid-feedback :state="error" class="text-left">
                {{ error }}
            </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group>
            <b-form-radio-group
                id="radio-group-part"
                v-model="part"
                name="part"
                :disabled="loading"
            >
                <b-form-radio :value="1">Partecipo</b-form-radio>
                <b-form-radio :value="0">Non partecipo</b-form-radio>
            </b-form-radio-group>
        </b-form-group>
        <b-overlay
            :show="loading"
            rounded
            opacity="0.6"
            spinner-small
            spinner-variant="primary"
        >
            <b-button
                variant="primary"
                size="sm"
                block
                type="submit"
                :disabled="loading"
            >
                Entra
            </b-button>
        </b-overlay>
    </b-form>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'StudentLoginForm',
    data() {
        return {
            studentId: '',
            part: 1,
            error: null,
            remember: false,
            loading: false
        };
    },
    methods: {
        ...mapActions('student', ['authStudent']),
        validation() {
            let valid = true;
            if (this.studentId.length === 0) {
                this.error = 'Matricola richiesta';
                valid = false;
            } else if (isNaN(this.studentId)) {
                this.error = 'Questa non è una matricola';
                valid = false;
            } else if (this.part !== 0 && this.part !== 1) {
                this.error = 'Selezione di partecipazione non valida';
                valid = false;
            } else {
                this.error = null;
            }
            return valid;
        },
        handleSubmit() {
            this.loading = true;
            if (!this.validation()) {
                this.loading = false;
                return;
            }

            this.authStudent({
                studentID: +this.studentId,
                part: this.part,
                remember: this.remember
            })
                .then(code => {
                    switch (code) {
                        case 1:
                            this.$router.push({ name: 'Iscrizione' });
                            break;
                        case 3:
                        case 4:
                            this.$router.push({ name: 'Conferma' });
                            break;
                        default:
                            console.log(code);
                            break;
                    }
                })
                .catch(err => {
                    this.loading = false;
                    this.error = err.message;
                });
        }
    }
};
</script>
