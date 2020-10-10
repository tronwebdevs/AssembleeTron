<template>
    <div class="dashboard">
        <h1>Dashboard</h1>
        <form @submit.prevent="findStd">
            <input type="number" placeholder="Student ID" v-model="searchID" />
            <input type="submit" value="Go" />
        </form>
        <br />
        <b class="error" v-if="error">{{ error }}</b>
        <div class="student_div" v-if="student._id">
            <b>ID: </b> {{ student._id }}<br />
            <b>Nome: </b> {{ student.name }}<br />
            <b>Cognome: </b> {{ student.surname }} <br /><b>Classe: </b>
            {{ student.section }}<br />
        </div>
    </div>
</template>

<style scoped lang="scss">
div.student_div {
    text-align: left;
    max-width: 400px;
    display: inline-block;
    padding: 20px;
    background-color: gainsboro;
}
b.error {
    display: block;
    margin: 20px 0;
    color: red;
}
</style>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    name: 'Dashboard',
    data() {
        return {
            error: null,
            searchID: 0
        };
    },
    computed: {
        ...mapState({
            student: state => state.student.profile
        })
    },
    methods: {
        ...mapActions('student', ['authStudent', 'logout']),
        ...mapActions('assembly', ['fetchAssemblyInfo']),
        findStd() {
            this.authStudent({
                studentID: this.searchID,
                part: 1,
                remember: false
            }).catch(err => {
                this.error = err.message;
                this.logout();
                setTimeout(() => (this.error = null), 2000);
            });
        },
        auth: function() {
            this.$store.dispatch('authStudent', {
                studentID: 11111,
                part: 1,
                remember: false
            });
        }
        // ...mapActions(['student'])
    },
    mounted() {
        // this.auth();
        console.log('mounted');
        // this.authStudent({
        //     studentID: 17687,
        //     part: 1,
        //     remember: false
        // });
        // this.fetchAssemblyInfo();
    },
    components: {}
};
</script>
