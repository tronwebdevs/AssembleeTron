<template>
    <div class="text-center">
        <NavBar />

        <div class="loading-wrapper" v-if="pageLoading">
            <b-spinner
                variant="secondary"
                label="Loading"
                class="loading-spinner"
            ></b-spinner>
        </div>
        <div v-else class="page-content d-flex flex-fill max-w-full text-left">
            <div class="flex-fill px-lg-2 mw-100">
                <b-container class="my-4">
                    <div class="page-header">
                        <div class="page-title-box">
                            <h1 class="page-title">{{ title }}</h1>
                        </div>
                    </div>
                    <b-alert
                        :variant="message.type"
                        fade
                        dismissible
                        @dismissed="clearMessage"
                        :show="message.show"
                        >{{ message.content }}</b-alert
                    >
                    <slot></slot>
                </b-container>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import NavBar from '@/components/Admin/NavBar';

export default {
    name: 'authed-wrapper',
    computed: {
        ...mapGetters('assembly', ['pendings', 'message']),
        title() {
            let route = this.$route.path
                .split('/')
                .slice(-1)
                .pop();
            if (!route) {
                route = 'dashboard';
            }
            return route.charAt(0).toUpperCase() + route.slice(1);
        },
        pageLoading() {
            return this.pendings.assembly !== false || this.loading;
        }
    },
    methods: {
        ...mapActions('assembly', ['fetchAssemblyGeneral', 'clearMessage'])
    },
    mounted() {
        if (this.pendings.assembly === undefined) {
            this.fetchAssemblyGeneral();
        }
    },
    props: {
        loading: Boolean
    },
    components: {
        NavBar
    }
};
</script>

<style scoped lang="scss">
.page-title-box {
    display: flex;
    align-items: center;
    min-height: 2.5rem;
    margin: 1rem 0;
    color: #888e9a;

    .page-title {
        margin: 0;
        font-size: 1.125rem;
        font-weight: 400;
        line-height: 1.5rem;
    }
}
.loading-wrapper {
    display: inline-block;
    padding: 10%;

    .loading-spinner {
        width: 4rem;
        height: 4rem;
    }
}
</style>
