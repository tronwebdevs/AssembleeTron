<template>
    <b-navbar toggleable="lg" variant="white" class="border-bottom">
        <b-container>
            <router-link
                :to="{ name: 'Admin/Dashboard' }"
                v-slot="{ href, navigate }"
            >
                <b-navbar-brand :href="href" @click="navigate">
                    <img :src="TWIcon" style="width:40px;height:40px" />
                </b-navbar-brand>
            </router-link>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav class="ml-auto text-left">
                    <router-link
                        v-for="(link, index) in links"
                        :key="index"
                        :to="{ name: 'Admin/' + link.name }"
                        v-slot="{ href, navigate, isExactActive }"
                    >
                        <b-nav-item
                            :active="isExactActive"
                            :href="href"
                            class="px-1"
                            @click="navigate"
                            >{{ link.label }}</b-nav-item
                        >
                    </router-link>

                    <b-nav-form class="ml-0 ml-lg-4">
                        <b-button
                            size="sm"
                            variant="outline-danger"
                            class="my-3 my-lg-0"
                            type="button"
                            @click="redirect"
                            >Logout</b-button
                        >
                    </b-nav-form>
                </b-navbar-nav>
            </b-collapse>
        </b-container>
    </b-navbar>
</template>

<script>
import { mapActions } from 'vuex';
import TWIcon from '@/assets/tw-logo.png';

export default {
    name: 'NavBar',
    data() {
        return {
            links: [
                { name: 'Dashboard', label: 'Home' },
                { name: 'Info', label: 'Informazioni' },
                { name: 'Labs', label: 'Laboratori' },
                { name: 'Stats', label: 'Statistiche' },
                { name: 'Export', label: 'Esporta' }
            ]
        };
    },
    computed: {
        TWIcon: () => TWIcon
    },
    methods: {
        ...mapActions('admin', ['logout']),
        redirect() {
            this.logout();
            this.$router.push({ name: 'Admin/Login' });
        }
    }
};
</script>
