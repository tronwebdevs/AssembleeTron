<template>
    <b-card class="text-center" :title="title">
        <div v-if="loading" class="py-4">
            <b-spinner
                label="Loading"
                variant="primary"
                style="width:3rem;height:3rem"
            ></b-spinner>
        </div>
        <div v-else>
            <span class="d-block text-center text-muted mb-3 subtitle">
                {{ subtitle }}
            </span>
            <b-card-text
                :class="{ 'text-left': !centred }"
                class="pb-0 mb-1"
                v-if="text"
            >
                {{ text }}
            </b-card-text>

            <div v-if="exists">
                <StudentLoginForm />
            </div>
        </div>
    </b-card>
</template>

<script>
import StudentLoginForm from '@/components/StudentLoginForm';
import { mapGetters } from 'vuex';

export default {
    name: 'FormCard',
    computed: {
        ...mapGetters('assembly', ['exists'])
    },
    props: {
        title: String,
        subtitle: String,
        text: String,
        centred: Boolean,
        loading: Boolean
    },
    components: {
        StudentLoginForm
    }
};
</script>

<style scoped>
.subtitle {
    font-size: 0.8rem;
}
</style>
