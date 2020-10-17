<template>
    <b-form @submit.prevent="handleSubmit" autocomplete="off" class="mt-2">
        <b-form-group>
            <b-input
                v-model="password"
                placeholder="Password"
                type="password"
                :disabled="loading"
                autofocus
                :state="error === null ? error : false"
            ></b-input>
            <b-form-invalid-feedback :state="error" class="text-left">
                {{ error }}
            </b-form-invalid-feedback>
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
                Login
            </b-button>
        </b-overlay>
    </b-form>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'AdminLoginForm',
    data() {
        return {
            password: '',
            error: null,
            loading: false
        };
    },
    methods: {
        ...mapActions('admin', ['authAdmin']),
        validation() {
            let valid = true;
            if (this.password.length === 0) {
                this.error = 'Password richiesta';
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

            this.authAdmin(this.password)
                .then(() => this.$router.push({ name: 'Admin/Dashboard' }))
                .catch(err => {
                    this.loading = false;
                    this.error = err.message;
                });
        }
    }
};
</script>
