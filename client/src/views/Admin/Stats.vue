<template>
    <authed-wrapper>
        <h1 class="text-center text-muted"><i>Working In Progress</i></h1>
        <b-button @click="btn">Toast</b-button>
    </authed-wrapper>
</template>

<script>
import Vue from 'vue';
import authedwrapper from '@/components/Admin/authed-wrapper';

export default {
    name: 'Stats',
    methods: {
        btn() {
            Vue.$toast.open('successo gg wp');
        }
    },
    components: {
        'authed-wrapper': authedwrapper
    }
};
</script>
