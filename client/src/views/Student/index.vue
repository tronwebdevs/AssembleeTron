<template>
    <transition name="slide-fade" mode="out-in">
        <router-view></router-view>
    </transition>
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

<style>
.slide-fade-enter-active {
    transition: all 0.2s ease;
}
.slide-fade-leave-active {
    transition: all 0.3s ease-out;
}
.slide-fade-enter,
.slide-fade-leave-to {
    transform: translateX(-10px);
    opacity: 0;
}
</style>
