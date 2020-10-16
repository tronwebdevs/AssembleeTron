<template>
    <b-form @submit.prevent="handleSubmit" autocomplete="off" class="mt-2">
        <b-form-group>
            <b-form-input
                v-model="password"
                placeholder="Password"
                autofocus
                type="password"
                :disabled="loading"
                required
            ></b-form-input>
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
            loading: false
        };
    },
    methods: {
        ...mapActions('admin', ['authAdmin']),
        handleSubmit() {
            this.loading = true;
            this.authAdmin(this.password)
                .then(data => {
                    if (data.code === 1) {
                        this.$router.push({ name: 'Dashboard' });
                    }
                })
                .catch(err => console.error(err));
        }
    }
};
</script>
