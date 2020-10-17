<template>
    <div class="mb-4">
        <DashAssemblyRow v-if="exists" />
        <NoAssembly v-else />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import NoAssembly from './NoAssembly';
import DashAssemblyRow from './DashAssemblyRow';

export default {
    name: 'AssemblyInfo',
    computed: {
        ...mapGetters('assembly', ['exists'])
    },
    components: {
        NoAssembly,
        DashAssemblyRow
    }
};
</script>
