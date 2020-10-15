<template>
    <tw-card class="text-center" :title="title">
        <div v-if="loading" class="py-12">
            <b-spinner
                label="Loading"
                variant="primary"
                style="width:3rem;height:3rem"
            ></b-spinner>
        </div>
        <div v-else>
            <tw-textd-isabled class="d-block text-center mb-3 subtitle">
                {{ subtitle }}
            </tw-textd-isabled>
            <b-card-text
                :class="{ 'text-left': !centred }"
                class="pb-0"
                v-if="text"
            >
                {{ text }}
            </b-card-text>

            <div class="px-4 pb-4" v-if="exists">
                <!-- <StudentLoginForm /> -->
            </div>
        </div>
    </tw-card>
</template>

<script>
import twcard from '@/components/tw-card.vue';
import twtextdisabled from '@/components/tw-text-disabled';
// import StudentLoginForm from '@/components/StudentLoginForm';
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
        'tw-card': twcard,
        'tw-textd-isabled': twtextdisabled
        // StudentLoginForm
    }
};
</script>

<style scoped>
.subtitle {
    font-size: 0.8rem;
}
</style>
