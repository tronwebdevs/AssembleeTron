<template>
    <b-card class="text-center" bg-variant="primary" text-variant="white">
        <h4 class="mb-0">
            {{ studentInfo }}
        </h4>
    </b-card>
</template>

<script>
export default {
    name: 'StudentBadge',
    computed: {
        studentInfo() {
            const { name, surname, section } = this.student;
            return name + ' ' + surname + ' - ' + section;
        }
    },
    props: {
        student: Object
    }
};
</script>

<style scoped>
h4 {
    font-size: 0.9rem !important;
}
</style>
