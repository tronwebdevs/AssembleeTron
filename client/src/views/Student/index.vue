<template>
    <div id="student">
        <router-view></router-view>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'Student',
    computed: {
        ...mapGetters('assembly', ['pendings', 'info'])
    },
    methods: {
        ...mapActions('assembly', ['fetchAssemblyInfo'])
    },
    mounted() {
        if (this.pendings.info === undefined) {
            this.fetchAssemblyInfo();
        }
    }
};
</script>
