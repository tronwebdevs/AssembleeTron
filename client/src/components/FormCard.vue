<template>
    <v-card class="text-center" outlined elevation="1" tile>
        <div v-if="loading" class="py-12">
            <v-progress-circular
                indeterminate
                size="32"
                color="primary"
            ></v-progress-circular>
        </div>
        <div v-else>
            <v-card-title class="mb-2 justify-center">{{ title }}</v-card-title>
            <v-card-subtitle class="d-block text--secondary" v-if="subtitle">
                {{ subtitle }}
            </v-card-subtitle>
            <v-card-text
                :class="{ 'text-left': !centred }"
                class="pb-0"
                v-if="text"
            >
                {{ text }}
            </v-card-text>

            <div class="px-4 pb-4" v-if="exists">
                <StudentLoginForm />
            </div>
        </div>
    </v-card>
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
    components: { StudentLoginForm }
};
</script>
